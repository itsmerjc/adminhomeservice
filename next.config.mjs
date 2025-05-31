/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development', // Use unoptimized images in development for easier testing
  },
  // Fix issues with Cloudinary SDK
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
    };
    return config;
  },
  experimental: {
    // Allow more time for serverless function execution
    serverComponentsExternalPackages: ['cloudinary'],
    serverActions: {
      bodySizeLimit: '10mb', // Increase the size limit for file uploads
    },
  },
  // Allow more time for API requests
  api: {
    responseLimit: '8mb',
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default nextConfig; 