"use client";

import React, { useEffect, useState } from "react";
import { getPageRequest } from '@/service/blogservice'
import  Card  from './card'

interface Comment {
    slug?: string
    content?: string
    createdAt?: string
    imgUrl?: string
    nickname?: string
}

export default function Login() {

    const[commentList, setCommentList] = useState<Comment[]>([]);

    useEffect(() => {
        getCommentList();
    },[]);

    
    async function getCommentList(){
        const comments = await getPageRequest("/comment/get", "chomanki.com", 1) ?? [];
        setCommentList(comments);
    }
  

    return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/25 to-black">
        <div>
            {Array.isArray(commentList) && commentList.map( (comment,key) => {
                    return (
                        <div key={key}> 
                        <Card   
                                slug={comment.slug}
                                content={comment.content}
                                createdAt={comment.createdAt}
                                imgUrl={comment.imgUrl}
                                nickname={comment.nickname}
                        /> 
                        
                        </div>
                    )
                    })
            }
        </div>
        
      <a href={`http://localhost:8080/oauth2/authorization/google`}> 구글 로그인</a>
      <a href={`http://localhost:8080/oauth2/authorization/github`}> 깃헙 로그인</a>

    </div>
  );

}
