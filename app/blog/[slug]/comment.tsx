"use client"

import { useState, useEffect,useRef } from 'react';
import { Redis } from "@upstash/redis";

export const revalidate = 0;
const redis = new Redis({
  url: '',
  token: '',
})

type Comment = {
  id: string;
  user: string;
  content: string;
};

type Props = {
  params: {
    slug: string;
  };
};


export const CommentSection = ({ params }: Props ) => {

  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const slug = params?.slug;

  const fetchComments = async () => {
    const commentsData = await redis.lrange<Comment>(['comments', 'blog', slug].join(':'), 0, -1) ?? [];
    const comments = commentsData.map(commentData => commentData);
    setComments(comments);
  };

  useEffect(() => {
    fetchComments();
  },[] );

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [commentContent]);

  const handleCommentSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    
    const newComment = {
      id: Math.random().toString(),  // 임시 ID 생성 로직, 실제로는 고유한 ID를 생성해야 합니다.
      user: 'username',  // OAuth를 통해 가져온 사용자 이름
      content: commentContent,
      slug: slug
    };
  
    await redis.lpush(['comments', 'blog', slug].join(':'), JSON.stringify(newComment));
  
    setCommentContent('');
    fetchComments();
  };

  return (
    <div className="space-y-8">
      <div className="text-xl font-bold"> 댓글 </div>
    <div className="space-y-4">
      {comments.map((comment) =>
        <div key={comment.id} className="p-4 border rounded shadow bg-zinc-100">
          <h3 className="mx-10 my-3 text-sm font-bold">{comment.user}
          <div className="mt-1 mb-8 w-full h-px bg-gray-400" />
          </h3>
          <p className="mx-10 mb-8 ">{comment.content}</p>
        </div>
      )}
    </div>
    <div>
      <form onSubmit={handleCommentSubmit} className="flex space-x-4">
        <textarea
            ref={textareaRef}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="break-words text-ellipsis overflow-hidden flex-grow h-32 p-2 border rounded shadow resize-y"
        />
        <button
          type="submit"
          className="h-20 bg-gray-600 text-white rounded shadow hover:bg-gray-700"
        >   <p className="mx-10"> 작성 </p>
        </button>
      </form>
    </div>
  </div>
  );
};
