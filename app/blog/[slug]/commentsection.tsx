'use client'

import { useState, useEffect } from 'react';
import { Redis } from "@upstash/redis";
import Comment from './comment';
import CommentForm from './commentform';

const url = '${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL}';
const token = '${process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN}';

const redis = new Redis({
  url: url,
  token: token,
})

type CommentType = {
  id: string;
  user: string;
  content: string;
};

type Props = {
  params: {
    slug: string;
  };
};

export default function CommentSection({ params }: Props ) {
  const slug = params?.slug;
  const [comments, setComments] = useState<CommentType[]>([]);

  const fetchComments = async () => {
    const commentsData = await redis.lrange<CommentType>(['comments', 'blog', slug].join(':'), 0, -1) ?? [];
    setComments(commentsData);
  };

  useEffect(() => {
    fetchComments();
  },[] );
  
  return (
    <div className="space-y-8">
      <div className="text-xl font-bold"> 댓글 </div>
      <div className="space-y-4">
        {comments.map((comment) => <Comment key={comment.id} comment={comment} />)}
      </div>
      <CommentForm slug={slug} onCommentSubmit={fetchComments} />
    </div>
  );
};
