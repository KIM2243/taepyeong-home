/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async redirects() {
    return [
      {
        source: '/products/:path*',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
