const { withContentlayer } = require("next-contentlayer");

module.exports = withContentlayer({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    experimental: {
        mdxRs: true,
    }
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL;


const nextConfig = {
	reactStrictMode: true,
   	swcMinify: true,
    env: {
        redisUrl: '${process.env.UPSTASH_REDIS_REST_URL}',
        redisToken: '${process.env.UPSTASH_REDIS_REST_TOKEN}',
        baseUrl: '${process.env.BASE_URL}',
        localBaseUrl: '${process.env.LOCAL_BASE_URL}',
    },
    images: {
        domains: ['lh3.googleusercontent.com','avatars.githubusercontent.com'],
    },
    async redirects() {
        return [

            
        ]
    },
    async rewrites() { 
        return [

            // Blog API 관련
            {
                source: '/api/blog/comment',
                has: [
                    {
                        type: 'query',
                        key: 'slug',
                        value: '(?<slug>.*)',
                    },
                    {
                        type: 'query',
                        key: 'page',
                        value: '(?<page>.*)',
                    },
                ],
                destination: BASE_URL+`/comment?slug=:slug&page=:page`
            },
            {
                source: '/api/blog/comment/post/:userId',
                destination: BASE_URL+`/comment?userId=:userId`
            },
            {
                source: '/api/blog/comment/delete/:commentId/:userId',
                destination: BASE_URL+`/comment?commentId=:commentId&userId=:userId`
            },
            {
                source: '/api/blog/user',
                destination: BASE_URL+`/user`
            },
            {
                source: '/api/blog/auth/refresh',
                destination: BASE_URL+`/auth/refresh`
            },






            // Blog Login 관련
            {
                source: '/auth/login/google',
                destination: BASE_URL+`/login/oauth2/authorization/google`,
            },
            {
                source: '/auth/login/github',
                destination: BASE_URL+`/login/oauth2/authorization/github`,
            },
            {
                source: '/auth/login/google',
                has: [
                    {
                        type: 'query',
                        key: 'prevPage',
                        value: '(?<prevPage>.*)',
                    }
                ],
                destination: BASE_URL+`/login/oauth2/authorization/google?prevPage=:prevPage`,
            },
            {
                source: '/auth/login/github',
                has: [
                    {
                        type: 'query',
                        key: 'prevPage',
                        value: '(?<prevPage>.*)',
                    }
                ],
                destination: BASE_URL+`/login/oauth2/authorization/github?prevPage=:prevPage`,
            },
        ]
    }
};

module.exports = nextConfig;