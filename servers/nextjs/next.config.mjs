const nextConfig = {
  reactStrictMode: false,
  output: "standalone",

  // Rewrites: proxy /api/v1/* requests to the FastAPI backend
  async rewrites() {
    const fastApiUrl = process.env.PRESENTON_BASE_URL || process.env.NEXT_PUBLIC_FAST_API || 'http://localhost:8000';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${fastApiUrl}/api/v1/:path*`,
      },
      {
        source: '/app_data/:path*',
        destination: `${fastApiUrl}/app_data/:path*`,
      },
      {
        source: '/static/:path*',
        destination: `${fastApiUrl}/static/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-7c765f3726084c52bcd5d180d51f1255.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pptgen-public.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "pptgen-public.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
      {
        protocol: "https",
        hostname: "present-for-me.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "yefhrkuqbjcblofdcpnr.supabase.co",
      },
      {
        protocol: "https",
        hostname: "uoxvkrvkzhmjxraijwzo.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
  },
  
};

export default nextConfig;
