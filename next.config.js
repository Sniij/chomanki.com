const { withContentlayer } = require("next-contentlayer");

module.exports = withContentlayer({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    experimental: {
        mdxRs: true,
    },
    env: {
        redisUrl: '${process.env.UPSTASH_REDIS_REST_URL}',
        redisToken: '${process.env.UPSTASH_REDIS_REST_TOKEN}',
        baseUrl: '${process.env.BASE_URL}',
        localBaseUrl: '${process.env.LOCAL_BASE_URL}',
    },
    images: {
        domains: ['lh3.googleusercontent.com','avatars.githubusercontent.com'],
    },
    reactStrictMode: false,
});