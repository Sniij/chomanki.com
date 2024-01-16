'use client'

import { useState, useRef, useEffect } from 'react';
import { Redis } from "@upstash/redis";


const redis = new Redis({
  url:'',
  token: '',
})
type CommentFormProps = {
  slug: string;
  onCommentSubmit: () => void;
};

export default function CommentForm({ slug, onCommentSubmit }: CommentFormProps) {
  const [commentContent, setCommentContent] = useState('');
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
    onCommentSubmit();
  };

  return (
    <form onSubmit={handleCommentSubmit} className="flex space-x-4">
      <textarea
        ref={textareaRef}
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        className="break-words text-ellipsis overflow-hidden flex-grow h-32 p-2 border rounded shadow resize-y"
      />
        <button
        type="submit"
        disabled={!commentContent.trim()}
        className={`h-20 rounded shadow hover:bg-gray-700 ${!commentContent.trim() ? 'bg-gray-700 text-gray-500' : 'bg-gray-600 text-white'}`}
        >      <p className="mx-10"> 작성 </p>
      </button>
    </form>
  )
}