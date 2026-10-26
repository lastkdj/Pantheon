import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Fixture snapshots are read from disk at runtime; make sure Vercel ships them.
  outputFileTracingIncludes: { "/**": ["./fixtures/**/*"] },
};

export default nextConfig;
