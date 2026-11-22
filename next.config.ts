import type { NextConfig } from "next";
import { execSync } from "node:child_process";

// Site version: MAJOR.MINOR.PATCH.
//   MAJOR — a redesign or rebuild of the site.
//   MINOR — something new for visitors: a page, a case study, a feature.
//   PATCH — fixes and small adjustments; counted automatically.
// MAJOR and MINOR come from the latest git tag (e.g. v1.11.0); PATCH is that
// tag's patch number plus the commits made since it. To release a new minor
// or major version, tag the commit and push the tag:
//   git tag -a v1.12.0 -m "New case study" && git push origin v1.12.0
// The deploy workflow checks out full history with tags (fetch-depth: 0).
function siteVersion() {
  try {
    const described = execSync('git describe --tags --long --match "v[0-9]*.[0-9]*.[0-9]*"', {
      stdio: ["ignore", "pipe", "ignore"],
    }).toString().trim();
    const match = described.match(/^v(\d+)\.(\d+)\.(\d+)-(\d+)-g[0-9a-f]+$/);
    if (!match) return "";
    const [, major, minor, patch, since] = match;
    return `${major}.${minor}.${Number(patch) + Number(since)}`;
  } catch {
    return "";
  }
}

const nextConfig: NextConfig = {
  // Static export — outputs to /out, deployable to any web server (cPanel, etc.)
  output: 'export',

  // Emit /about/index.html instead of /about.html — better cPanel compatibility
  trailingSlash: true,

  // next/image optimisation requires a server; use unoptimized for static export
  images: {
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_SITE_VERSION: siteVersion(),
  },
};

export default nextConfig;
