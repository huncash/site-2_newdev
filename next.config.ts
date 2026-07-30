import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_ID: "site-2",
  },
  serverExternalPackages: ["better-sqlite3", "bcryptjs"],
};

export default nextConfig;
