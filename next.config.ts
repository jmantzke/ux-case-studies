import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — outputs to /out, deployable to any web server (cPanel, etc.)
  output: 'export',

  // Emit /about/index.html instead of /about.html — better cPanel compatibility
  trailingSlash: true,

  // next/image optimisation requires a server; use unoptimized for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
