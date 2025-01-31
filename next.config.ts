import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	distDir: 'out',
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
