import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'mernspace-pizza-application-project.s3.eu-north-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
