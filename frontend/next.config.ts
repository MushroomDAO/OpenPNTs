import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Webpack配置 - 处理客户端fallback
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };
    return config;
  },
};

export default nextConfig;
