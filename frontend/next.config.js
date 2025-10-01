/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "ipfs.io"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || "default_key",
  },
};

module.exports = nextConfig;
