import type { NextConfig } from "next";
import { execSync } from "node:child_process";

// Site version: the number of commits in the history being built. Every push
// to main adds commits and triggers a deploy, so the number goes up by itself
// with each release; nothing to bump by hand. The deploy workflow checks out
// the full history (fetch-depth: 0) so the count is right in CI too.
function siteVersion() {
  try {
    return execSync("git rev-list --count HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
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
