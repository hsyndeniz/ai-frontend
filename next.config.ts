import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	distDir: 'build',
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
