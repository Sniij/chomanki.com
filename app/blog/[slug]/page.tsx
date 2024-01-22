import { notFound } from "next/navigation";
import { allBlogs } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";
import Comment from '@/app/components/comment'
import {cookies} from 'next/headers';

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

const redis = Redis.fromEnv();

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allBlogs
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {

  const slug = params?.slug;
  const blog = allBlogs.find((blog) => blog.slug === slug);

  if (!blog) {
    notFound();
  }

  const cookieStore = cookies();
  const JSESSIONID = cookieStore.get('JSESSIONID')?.value ?? "";

  const views =
    (await redis.get<number>(["pageviews", "blog", slug].join(":"))) ?? 0;


  return (
    <div className="bg-zinc-50 min-h-screen">
        <ReportView slug={blog.slug} />

      <Header blog={blog} views={views} />
      <article className="font-bold font-GSans px-4 py-12 mx-auto prose prose-zinc prose-quoteless max-w-4xl">
        <Mdx code={blog.body.code} />     
        <div className="mt-20 w-full h-px bg-zinc-800" />
      </article>

      <article className="font-bold font-GSans px-4 py-12 mx-auto prose prose-zinc prose-quoteless max-w-4xl">
        <Comment slug={slug} jsessionid={JSESSIONID}/>
      </article>

    </div>
  );
}
