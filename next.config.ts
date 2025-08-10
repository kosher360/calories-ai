// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Don’t fail production builds because of ESLint errors
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
