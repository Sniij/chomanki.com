"use client";

import React, { useEffect, useState, useRef } from "react";
import { getPageRequest, postRequest, deleteRequest } from '@/service/blogservice'
import CommentDetail from '../components/commentdeatail'

interface CommentProps {
    slug: string;
}

interface Comment {
    id: string;
    slug: string;
    content: string;
    createdAt: string;
    imgUrl: string;
    nickname: string;
}

interface CommentListInfo {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

interface CommentRequest {
    slug?: string;
    content?: string;
}

export default function Comment({ slug }: CommentProps) {
    const [commentList, setCommentList] = useState<Comment[]>([]);
    const [content, setContent] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<CommentListInfo>();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [content]);

    useEffect(() => {
        getCommentList(page);
    }, [page]);

    async function getCommentList(page: number){
        const comments = await getPageRequest(`/comment`, slug, page);
        if (comments && Array.isArray(comments)) {
            setCommentList(comments);
        }
    }

    async function postComment(content: string){

        let obj: CommentRequest = {
            slug: slug,
            content: content
        };

        const response = await postRequest(`/comment`, obj );

        if (response) {
            const comment: Comment = response.data;

            setContent("");
            await getCommentList(page);
        }
    }

    async function deleteComment(id: string){
        const response = await deleteRequest(`/comment`, id);
        if (response) {
            setCommentList(commentList.filter(comment => comment.id !== id));
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-xl font-bold"> 댓글 </div>
                <div className="space-y-4">
                    {commentList.map((comment) => (
                            <CommentDetail key={comment.id} comment={comment} />
                        ))}
                </div>
                <div>
                <form onSubmit={(e) => postComment(content)} className="flex space-x-4">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="break-words text-ellipsis overflow-hidden flex-grow h-32 p-2 border rounded shadow resize-y"
                    />
                    <button
                        type="submit"
                        disabled={!content.trim()}
                        className={`h-20 rounded shadow hover:bg-gray-700 ${!content.trim() ? 'bg-gray-700 text-gray-500' : 'bg-gray-600 text-white'}`}
                        >      <p className="mx-10"> 작성 </p>
                    </button>
                </form>
                    <button onClick={() => setPage(page - 1)}> Previous </button>
                    <button onClick={() => setPage(page + 1)}> Next </button>
                </div>
        </div>
    );
}
