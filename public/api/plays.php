<?php
/**
 * Fake Papoose play counter.
 *
 *   GET  /api/plays.php          → { "counts": { "A1-T1": 12, ... } }
 *   POST /api/plays.php          → body { "track": "A1-T1" }; counts one play
 *   GET  /api/plays.php?my-ip    → { "ip": "...", "excluded": true|false }
 *
 * Data lives outside the web root so deploys (rsync --delete) never touch it:
 *   ~/domains/enfineitz.com/private/fake-papoose/
 *     plays.json         counts + recent-play window (created on first play)
 *     salt               random secret for hashing visitor IPs (created on first play)
 *     excluded-ips.txt   one IP or CIDR range per line; # starts a comment
 * Set FAKE_PAPOOSE_DATA to use another folder (local testing).
 */

declare(strict_types=1);

const TRACKS = ['A1-T1', 'A1-T3', 'A1-T4', 'A1-T7', 'A2-T2', 'A2-T3'];

// The same visitor replaying the same track within this window counts once.
const REPEAT_WINDOW = 600;

header('Content-Type: application/json');
header('Cache-Control: no-store');

$dataDir = getenv('FAKE_PAPOOSE_DATA') ?: dirname(__DIR__, 3) . '/private/fake-papoose';
$ip = $_SERVER['REMOTE_ADDR'] ?? '';

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function ipInRange(string $ip, string $range): bool
{
    [$subnet, $bits] = array_pad(explode('/', $range, 2), 2, null);
    $ipBin = @inet_pton($ip);
    $subnetBin = @inet_pton($subnet);
    if ($ipBin === false || $subnetBin === false || strlen($ipBin) !== strlen($subnetBin)) {
        return false;
    }
    $bits = $bits === null ? strlen($ipBin) * 8 : (int) $bits;
    $bytes = intdiv($bits, 8);
    if (substr($ipBin, 0, $bytes) !== substr($subnetBin, 0, $bytes)) {
        return false;
    }
    $rest = $bits % 8;
    if ($rest === 0) {
        return true;
    }
    $mask = (0xFF << (8 - $rest)) & 0xFF;
    return (ord($ipBin[$bytes]) & $mask) === (ord($subnetBin[$bytes]) & $mask);
}

function isExcluded(string $ip, string $dataDir): bool
{
    $file = "$dataDir/excluded-ips.txt";
    if (!is_readable($file)) {
        return false;
    }
    foreach (file($file, FILE_IGNORE_NEW_LINES) as $line) {
        $range = trim(explode('#', $line, 2)[0]);
        if ($range !== '' && ipInRange($ip, $range)) {
            return true;
        }
    }
    return false;
}

function emptyCounts(): array
{
    return array_fill_keys(TRACKS, 0);
}

function readCounts(string $dataDir): array
{
    $state = @json_decode((string) @file_get_contents("$dataDir/plays.json"), true);
    return array_merge(emptyCounts(), array_intersect_key($state['counts'] ?? [], emptyCounts()));
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    if (isset($_GET['my-ip'])) {
        respond(200, ['ip' => $ip, 'excluded' => isExcluded($ip, $dataDir)]);
    }
    respond(200, ['counts' => readCounts($dataDir)]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['error' => 'method not allowed']);
}

$body = json_decode((string) file_get_contents('php://input'), true);
$track = is_array($body) ? ($body['track'] ?? null) : null;
if (!in_array($track, TRACKS, true)) {
    respond(400, ['error' => 'unknown track']);
}

if (isExcluded($ip, $dataDir)) {
    respond(200, ['counts' => readCounts($dataDir), 'counted' => false]);
}

if (!is_dir($dataDir) && !@mkdir($dataDir, 0700, true)) {
    respond(500, ['error' => 'storage unavailable']);
}

$saltFile = "$dataDir/salt";
if (!is_readable($saltFile)) {
    file_put_contents($saltFile, bin2hex(random_bytes(32)), LOCK_EX);
    chmod($saltFile, 0600);
}
$visitor = hash('sha256', trim((string) file_get_contents($saltFile)) . "|$ip|$track");

$fp = fopen("$dataDir/plays.json", 'c+');
if ($fp === false || !flock($fp, LOCK_EX)) {
    respond(500, ['error' => 'storage unavailable']);
}

$state = json_decode((string) stream_get_contents($fp), true) ?: [];
$counts = array_merge(emptyCounts(), array_intersect_key($state['counts'] ?? [], emptyCounts()));
$now = time();
$recent = array_filter($state['recent'] ?? [], fn ($t) => $now - (int) $t < REPEAT_WINDOW);

$counted = !isset($recent[$visitor]);
if ($counted) {
    $counts[$track]++;
    $recent[$visitor] = $now;
}

ftruncate($fp, 0);
rewind($fp);
fwrite($fp, json_encode(['counts' => $counts, 'recent' => $recent]));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

respond(200, ['counts' => $counts, 'counted' => $counted]);
