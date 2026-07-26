/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.islamic.network'],
  },
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
};

module.exports = nextConfig;