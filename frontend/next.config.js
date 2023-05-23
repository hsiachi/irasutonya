/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '1.bp.blogspot.com',
            }
        ]
    }
}

module.exports = nextConfig
