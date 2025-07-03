import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	output: "standalone",
	// Optional: Configure trailing slash behavior
	trailingSlash: false,

	// Optional: Configure image optimization for container environments
	images: {
		unoptimized: process.env.NODE_ENV === "production"
	},

	// Optional: Configure experimental features if needed
	experimental: {
		// Enable if you're using app directory
		// appDir: true,
	}
};

export default nextConfig;
