import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native module used only on the server (SQLite). Keep it external so Next
  // doesn't try to bundle its .node binary.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
