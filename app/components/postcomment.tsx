"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { getPageRequest, postRequest, deleteRequest, getUserProfile } from '@/service/blogservice'
import { usePathname } from 'next/navigation';
import Comment from './comment'

type UserProfile = {
    id:string;
    nickname: string;
    imgUrl: string;
}

interface PostProps {
    isLoggedIn: boolean;
    userProfile: UserProfile;
    slug: string;
    page: number;
}

interface CommentRequest {
    slug?: string;
    content?: string;
}

async function post(content: string, slug: string){

    let obj: CommentRequest = {
        slug: slug,
        content: content
    };

    const response = await postRequest(`/comment`, obj );
    return response;
    
}


export default function PostComment({isLoggedIn, userProfile, slug, page}:PostProps) {

    const [content, setContent] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight+30}px`;
        }
    }, [content]);

    async function requestComment(content: string, slug: string){
        const response = await post(content, slug)
        if (response) {
            const comment: Comment = response.data;
    
            setContent("");
        }
    }


    const pathname = usePathname();
    const loginUrl = `http://localhost:8080/auth/login`;

    return (
        <div>
        { isLoggedIn &&
            <div className="mx-8 flex">
            <h4 className="mr-5 mt-3 text-gray-300 text-sm font-bold"> {" Current Account | "} </h4>
            <Image className="mt-1 text-gray-300 rounded-lg border border-zinc-200" src={userProfile.imgUrl} alt={userProfile.nickname} width={25} height={25}/>
            <h4 className="mt-2 mx-3 text-gray-300 text-base font-bold hover:text-blue-500">{userProfile.nickname} </h4>
            </div>
        }
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if(typeof window !== 'undefined') {
                        if(window.confirm("댓글을 작성하시겠습니까?")) {
                            requestComment(content, slug);
                        }
                    }
                }}
                    className="flex mx-8 space-x-4">

                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => {
                            if (e.target.value.length <= 500) {
                                setContent(e.target.value);
                            }
                        }}
                        className="w-9/12 min-h-32 bg-zinc-900/50 hover:bg-zinc-900 text-gray-300 break-words text-ellipsis overflow-hidden flex-grow h-32 p-2 border rounded-lg resize-y"
                        disabled={!isLoggedIn}  
                    />
                    <p className="text-xs">{`${content.length}/500`}</p>
                    { isLoggedIn &&
                    <button
                    type="submit"
                    disabled={!content.trim()}
                    className={` border rounded-lg  ${!content.trim() ? 'bg-zinc-900/50 text-gray-600' : 'bg-zinc-900/50 text-blue-500 hover:bg-zinc-800'}`}
                    >      <p className="font-bold mx-7"> post </p>
                    </button>
                    }
                    { !isLoggedIn &&
                    <a 
                        href={loginUrl+`?requesturl=http://localhost:3000${pathname}`}
                        className="w-85 h-85"
                    >
                        <Image className="rounded-lg" src='/signingoogle_sq_bl.png' alt="sign in with Google" width={100} height={50}/>
                    </a>
                    }
                </form>
        </div>
    )

}