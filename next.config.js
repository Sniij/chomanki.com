const { withContentlayer } = require("next-contentlayer");

module.exports = withContentlayer({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    experimental: {
        mdxRs: true,
    },
    env: {
        redisUrl: '${process.env.UPSTASH_REDIS_REST_URL}',
        redisToken: '${process.env.UPSTASH_REDIS_REST_TOKEN}'
    },
    images: {
        domains: ['lh3.googleusercontent.com','avatars.githubusercontent.com'],
    },
    reactStrictMode: false,
});