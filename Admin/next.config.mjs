/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://amigowebster.in/indolanka_v2/api/:path*'
          : 'http://localhost:5000/api/:path*'
      }
    ];
  }
};

export default nextConfig;
