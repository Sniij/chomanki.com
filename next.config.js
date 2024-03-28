const { withContentlayer } = require("next-contentlayer");

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL;
const API_KEY = process.env.API_KEY;
module.exports = withContentlayer({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    experimental: {
        mdxRs: true,
    },
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
            // Blog Login 관련
            {
                source: '/auth/login/google',
                destination: BASE_URL+`/login/oauth2/authorization/google`,
                permanent: false,
            },
            {
                source: '/auth/login/github',
                destination: BASE_URL+`/login/oauth2/authorization/github`,
                permanent: false,
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
                permanent: false,
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
                permanent: false,
            },
            
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
                    }
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

            // Blog Comment Reply
            {
                source: '/api/blog/comment/:commentId',
                has: [
                    {
                        type: 'query',
                        key: 'page',
                        value: '(?<page>.*)',
                    }
                ],
                destination: BASE_URL+`/comment/:commentId?page=:page`
            },
            {
                source: '/api/blog/comment/:commentId/:userId',
                destination: BASE_URL+`/comment/:commentId?userId=:userId`
            },
            {
                source: '/api/blog/comment/:commentId/:commentReplyId/:userId',
                destination: BASE_URL+`/comment/:commentId?commentReplyId=:commentReplyId&userId=:userId`
            },



            {
                source: '/api/blog/user',
                destination: BASE_URL+`/user`
            },
            {
                source: '/api/blog/auth/refresh',
                destination: BASE_URL+`/auth/refresh`
            },
        ]
    }
});