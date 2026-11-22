<?php
/**
 * Router for `npm run preview` (php -S … -t out scripts/preview-router.php).
 *
 * PHP's built-in server ignores HTTP Range requests and always sends the
 * whole file, so audio can't seek the way it does on the live server. This
 * serves byte ranges for audio and leaves every other request to the
 * built-in server.
 */

$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');
$file = realpath($_SERVER['DOCUMENT_ROOT'] . $path);
$root = realpath($_SERVER['DOCUMENT_ROOT']);

if (!$file || strpos($file, $root) !== 0 || !is_file($file) || !preg_match('/\.mp3$/i', $file)) {
    return false;
}

$size = filesize($file);
$start = 0;
$end = $size - 1;
header('Content-Type: audio/mpeg');
header('Accept-Ranges: bytes');

if (preg_match('/bytes=(\d*)-(\d*)/', $_SERVER['HTTP_RANGE'] ?? '', $m)) {
    if ($m[1] === '' && $m[2] !== '') {
        $start = max(0, $size - (int) $m[2]);
    } else {
        $start = (int) $m[1];
        if ($m[2] !== '') {
            $end = min($end, (int) $m[2]);
        }
    }
    if ($start > $end || $start >= $size) {
        http_response_code(416);
        header("Content-Range: bytes */$size");
        exit;
    }
    http_response_code(206);
    header("Content-Range: bytes $start-$end/$size");
}

$length = $end - $start + 1;
header("Content-Length: $length");
if ($_SERVER['REQUEST_METHOD'] === 'HEAD') {
    exit;
}
$fh = fopen($file, 'rb');
fseek($fh, $start);
while ($length > 0 && !feof($fh)) {
    $chunk = fread($fh, min(1 << 16, $length));
    echo $chunk;
    $length -= strlen($chunk);
}
fclose($fh);
