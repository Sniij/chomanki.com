"use client";

import React, { useEffect, useState } from "react";
import { getPageRequest, postRequest, deleteRequest } from '@/service/blogservice'

interface CommentProps {
    slug: string;
}

interface Comment {
    id?: string;
    slug?: string;
    content?: string;
    createdAt?: string;
    imgUrl?: string;
    nickname?: string;
}

interface CommentRequest {
    slug?: string;
    content?: string;
}

export default function Comment({ slug }: CommentProps) {
    const [commentList, setCommentList] = useState<Comment[]>([]);
    const [content, setContent] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getCommentList(page);
    }, [page]);

    async function getCommentList(page: number){
        const comments: Comment[] = await getPageRequest(`/comment`, slug, page);
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
            setCommentList([...commentList, comment]);
        }
    }

    async function deleteComment(id: string){
        const response = await deleteRequest(`/comment`, id);
        if (response) {
            setCommentList(commentList.filter(comment => comment.id !== id));
        }
    }

    return (
        <div>
            {commentList.map((comment) => (
                <div key={comment.id}>
                    <h4><img src={comment.imgUrl}/>{comment.nickname}</h4>
                
                    <p>{comment.content}</p>
                </div>
            ))}
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />

            <button onClick={() => postComment(content)}>Post</button>
            <button onClick={() => setPage(page - 1)}>Previous</button>
            <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
    );
}
