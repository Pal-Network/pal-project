/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@pal/ui"],
  experimental: {
    typedRoutes: false
  }
};

module.exports = nextConfig;
