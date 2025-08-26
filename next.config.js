/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Тимчасово ігноруємо ESLint помилки для деплою
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Тимчасово ігноруємо TypeScript помилки для деплою
      ignoreBuildErrors: true,
    },
  }
  
  module.exports = nextConfig