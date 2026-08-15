/** @type {import('next').NextConfig} */

const isMobile = process.env.NEXT_PUBLIC_BUILD_TARGET === 'mobile';
const BUILD_VERSION = Date.now().toString();

const nextConfig = {
  output: isMobile ? 'export' : 'standalone',
  trailingSlash: isMobile,
  images: {
    unoptimized: isMobile,
    domains: ['cdn.islamic.network'],
  },
  ...(isMobile
    ? {
        // Add build version for cache busting
        publicRuntimeConfig: {
          buildVersion: BUILD_VERSION,
        },
      }
    : {
        async rewrites() {
          return [
            {
              source: '/api/quran/:path*',
              destination: 'https://api.alquran.cloud/v1/:path*',
            },
            {
              source: '/api/quran-com/:path*',
              destination: 'https://api.quran.com/api/v4/:path*',
            },
          ];
        },
      }),
};

module.exports = nextConfig;
