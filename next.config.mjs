/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['bnorifyeoknrxzpbilbq.supabase.co'],
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
