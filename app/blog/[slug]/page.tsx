import { notFound } from "next/navigation";
import { allBlogs } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";
import Comment from '@/app/blog/[slug]/comment'

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

export const generateMetadata = async ({ params }: Props) => {
  return {
      title: params.slug
  }
}

export default async function PostPage({ params }: Props) {



  const slug = params?.slug;
  const blog = allBlogs.find((blog) => blog.slug === slug);

  if (!blog) {
    notFound();
  }

  const views =
    (await redis.get<number>(["pageviews", "blog", slug].join(":"))) ?? 0;


  return (
    <div className="bg-zinc-900/20  min-h-screen">
        <ReportView slug={blog.slug} />

      <Header blog={blog} views={views} />
      <article className=" text-gray-300 font-bold font-GSans px-4 py-12 mx-auto prose prose-zinc prose-quoteless max-w-4xl">
        <Mdx code={blog.body.code} />
        <div className="mt-20 w-full h-px bg-gray-300" />
      </article>

      <article className="font-bold font-GSans px-4 py-12 mx-auto prose prose-zinc prose-quoteless max-w-4xl">
        <Comment slug={slug}/>
      </article>

    </div>
  );
}
