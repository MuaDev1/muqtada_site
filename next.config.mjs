/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_TMDB_API_KEY: 'e01d2bb49cf0a06d4fbc873f1557ded8', // استبدل YOUR_TMDB_API_KEY بمفتاح TMDb API الخاص بك
      },  
    experimental: {
      appDir: true,
    },
  };
  
  export default nextConfig;
  