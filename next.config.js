/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'lh3.googleusercontent.com',
      'img.clerk.com',
      'utfs.io',
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  //enable app dir
};

module.exports = nextConfig;
