/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',

    basePath: '/js-particles',
    assetPrefix: '/js-particles',

    trailingSlash: true,

    images: {
        unoptimized: true,
    },
};

export default nextConfig;
