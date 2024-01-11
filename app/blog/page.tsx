import Link from "next/link";
import React from "react";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Eye } from "lucide-react";
import { Redis } from "@upstash/redis";
import { allBlogs } from "contentlayer/generated";
import { Article } from "./article";
import type { Blog } from "@/.contentlayer/generated";
import Particles from "../components/particles";

const redis = Redis.fromEnv();
export const revalidate = 60;
const postsPerPage = 2;

  
interface BlogPageProps {
    blog?: Blog[]; 
    currentPage?: number;
    totalPages?: number;
}



export default async function BlogPage({ 
    blog, 
    currentPage = 1, 
    totalPages 
}: BlogPageProps) {


    const views = (
        await redis.mget<number[]>(
            ...allBlogs.map((p) => ["pageviews", "blog", p.slug].join(":")),
        )
    ).reduce((acc, v, i) => {
        acc[allBlogs[i].slug] = v ?? 0;
        return acc;
    }, {} as Record<string, number>);
    
    // view 기준으로 정렬
    const sortedByViews = [...allBlogs].sort((a, b) => views[b.slug] - views[a.slug]);

    const top1 = sortedByViews[0];
    const top2 = sortedByViews[1];
    const top3 = sortedByViews[2];

    const rest = sortedByViews
       // .slice(3) // Top1, Top2 제외
       // .filter((p) => p.published)
        .sort(
          (a, b) =>
            new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
            new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
        );

return (
    <div className="relative pb-16">
        <Navigation />
        <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={100}
         />
            <div className="max-w-2xl mx-auto lg:mx-0">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                Blog
                </h2>
                <p className="font-GSans text-lg mt-4 text-zinc-400">
                저만의 기록 공간입니다.
                </p>
            </div>
                <div className="w-full h-px bg-zinc-800" />
                    <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
                        <Card>
                            <Link href={`/blog/${top1.slug}`}>
                                <article className="relative w-full h-full p-4 md:p-8">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-xs text-zinc-100">
                                            {top1.date ? (
                                            <time dateTime={new Date(top1.date).toISOString()}>
                                                {Intl.DateTimeFormat(undefined, {
                                                dateStyle: "medium",
                                                }).format(new Date(top1.date))}
                                            </time>
                                            ) : (
                                            <span>SOON</span>
                                            )}
                                        </div>
                                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                                            <Eye className="w-4 h-4" />{" "}
                                            {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                                            views[top1.slug] ?? 0,
                                            )}
                                        </span>
                                    </div>

                                    <h2
                                    id="featured-post"
                                    className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                                    >
                                        {top1.title}
                                    </h2>
                                    <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                                        {top1.description}
                                    </p>
                                        <div className="absolute bottom-4 md:bottom-8">
                                            <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                                                Read more <span aria-hidden="true">&rarr;</span>
                                            </p>
                                        </div>
                                </article>
                            </Link>
                        </Card>
                        <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
                            {[top2, top3].map((blog) => (
                            <Card key={blog.slug}>
                                <Article blog={blog} views={views[blog.slug] ?? 0} />
                            </Card>
                            ))}
                        </div>
                    </div>
                        <div className="hidden w-full h-px md:block bg-zinc-800" />
                            <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
                            <div className="grid grid-cols-1 gap-4">
                                {rest
                                .filter((_, i) => i % 3 === 0)
                                .map((blog) => (
                                    <Card key={blog.slug}>
                                    <Article blog={blog} views={views[blog.slug] ?? 0} />
                                    </Card>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {rest
                                .filter((_, i) => i % 3 === 1)
                                .map((blog) => (
                                    <Card key={blog.slug}>
                                    <Article blog={blog} views={views[blog.slug] ?? 0} />
                                    </Card>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {rest
                                .filter((_, i) => i % 3 === 2)
                                .map((blog) => (
                                    <Card key={blog.slug}>
                                    <Article blog={blog} views={views[blog.slug] ?? 0} />
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
);
}
