/** @param {string} phase */
const nextConfig = (phase) => ({
  // Keep development and production caches separate so `next build` cannot
  // corrupt a running `next dev` session on this filesystem.
  distDir: phase === "phase-development-server" ? ".next-dev" : ".next",
  reactStrictMode: true,
  serverExternalPackages: ["mongoose", "bcryptjs"],
});

export default nextConfig;
