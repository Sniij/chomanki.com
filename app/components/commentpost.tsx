"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";

type UserProfile = {
    userId:string;
    nickname: string;
    imgUrl: string;
}

interface CommentPostProps {
    getUserProfileByComment: () => Promise<UserProfile | null>;
    postComment: (content: string) => Promise<void>;
    slug: string;
    isLoggedIn: boolean;
}

interface CommentReplyPostProps {
    getUserProfileByComment: () => Promise<UserProfile | null>;
    postCommentReply: (parent: string, content: string) => Promise<ServerStatusResponse | null>;
    refreshReplies: () => Promise<void>;
    slug: string;
    isLoggedIn: boolean;
    parent: string;
}
interface ServerStatusResponse {
	status: number;
}

export function CommentPost(commentPostProps: CommentPostProps ) {
    const [content, setContent] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>();

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight+30}px`;
        }
    }, [content]);

    useEffect(() => {
        if(commentPostProps.isLoggedIn){
            setUser();
        }
    }, );

    async function setUser() {
        const user = await commentPostProps.getUserProfileByComment();
        setUserProfile(user);
    }

    async function handlePostComment(content: string) {
        commentPostProps.postComment(content);
        setContent("");
    }

    return (
        <div className="relative duration-150 p-4 rounded-lg text-gray-300 bg-zinc-900 hover:bg-zinc-800/20">
        <div className="flex text-gray-300 my-4 ml-8 font-bold font-GSans tracking-tight text-lg sm:text-xl font-display">
            Post comment  
        </div>
        { commentPostProps.isLoggedIn && userProfile &&
                <div className="mx-8 flex">
                <Image className="mt-1 text-gray-300 rounded-lg border border-zinc-200 w-6 sm:w-7" src={userProfile.imgUrl} alt={userProfile.nickname} width={25} height={25}/>
                <h4 className="duration-150 mt-2 mx-3 text-gray-300 text-base sm:text-sm text-xs font-bold hover:text-blue-500">{userProfile.nickname} </h4>
                </div>
        }
        <form onSubmit={(e) => {
            e.preventDefault();
            if(typeof window !== 'undefined') {
                if(window.confirm("댓글을 작성하시겠습니까?")) {
                    handlePostComment(content);
                }
            }}
            }
            className="mx-6 space-x-4">
            <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => {
                    if (e.target.value.length <= 500) {
                        setContent(e.target.value);
                    }
                }}
                className="w-full min-h-32 bg-zinc-900/50 hover:bg-zinc-900 text-gray-300 break-words text-ellipsis overflow-hidden flex-grow h-32 p-2 border rounded-lg resize-y "
                disabled={!commentPostProps.isLoggedIn}  
            />
            <div className="flex mx-6 w-full">
            <p className="text-xs">{`${content.length}/500`}</p>
            { commentPostProps.isLoggedIn &&
            <div className="absolute bottom-3 right-10 w-32 h-10 border rounded-lg duration-150 bg-zinc-900/50 hover:bg-zinc-900">
            <button
            type="submit"
            disabled={!content.trim()}
            className={`flex items-center justify-center h-full w-full border rounded-lg  ${!content.trim() ? 'bg-zinc-900/50 text-gray-600' : 'bg-zinc-900/50 text-blue-500 hover:bg-zinc-800'}`}
            >      <p className="font-bold sm:text-base text-xs"> post </p>
            </button></div>
            }
            { !commentPostProps.isLoggedIn &&
                <div className="absolute bottom-3 right-10 w-32 h-10 border rounded-lg duration-150 bg-zinc-900/50 hover:bg-zinc-900">
                <Link href={`/blog/login?redirect=`+commentPostProps.slug}>
                    <div className="flex items-center justify-center w-full h-full text-gray-300 hover:text-blue-500 duration-150">
                        <p className="font-bold sm:text-base text-xs">Login</p>
                    </div>
                </Link> 
                </div>
            }
        </div>
        </form>
    </div>
    )
}


export function CommentReplyPost(commentReplyPostProps: CommentReplyPostProps ) {

    const [content, setContent] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>();

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight+15}px`;
        }
    }, [content]);

    useEffect(() => {
        if(commentReplyPostProps.isLoggedIn){
            setUser();
        }
    }, );

    async function setUser() {
        const user = await commentReplyPostProps.getUserProfileByComment();
        setUserProfile(user);
    }

    async function handlePostCommentReply(content: string) {

        const response = await commentReplyPostProps.postCommentReply(commentReplyPostProps.parent, content);

        if(response?.status === 201){
            commentReplyPostProps.refreshReplies();
            setContent("");
        }else{
            alert("작성에 실패하였습니다.");
        }
    }

    return (
        <div className="mt-5 z-0 duration-150 p-4 rounded-lg text-gray-300 bg-zinc-900 hover:bg-zinc-800/20">

        { commentReplyPostProps.isLoggedIn && userProfile &&
                <div className="mx-8 my-2 flex">
                <Image className="mt-1 text-gray-300 rounded-lg border border-zinc-200 w-6 sm:w-7" src={userProfile.imgUrl} alt={userProfile.nickname} width={25} height={25}/>
                <h4 className="duration-150 mt-2 mx-3 text-gray-300 text-base sm:text-sm text-xs font-bold hover:text-blue-500">{userProfile.nickname} </h4>
                </div>
        }
        <form onSubmit={(e) => {
            e.preventDefault();
            if(typeof window !== 'undefined') {
                if(window.confirm("댓글을 작성하시겠습니까?")) {
                    handlePostCommentReply(content);
                }
            }}
            }
            className="mx-6 space-x-4">
            <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => {
                    if (e.target.value.length <= 300) {
                        setContent(e.target.value);
                    }
                }}
                className="w-full min-h-32 bg-zinc-900/50 hover:bg-zinc-900 text-gray-300 break-words text-ellipsis overflow-hidden flex-grow h-32 p-2 border rounded-lg resize-y "
                disabled={!commentReplyPostProps.isLoggedIn}  
            />
            <div className="flex justify-between z-0 mx-6 w-full">
                <div>
                <p className="w-1/3 text-xs">{`${content.length}/300`}</p>
                </div>
                <div></div>
                { commentReplyPostProps.isLoggedIn &&
                    <div className="mx-4 my-2 w-32 h-10 border rounded-lg duration-150 bg-zinc-900/50 hover:bg-zinc-900">
                        <button
                        type="submit"
                        disabled={!content.trim()}
                        className={`flex items-center justify-center h-full w-full border rounded-lg  ${!content.trim() ? 'bg-zinc-900/50 text-gray-600' : 'bg-zinc-900/50 text-blue-500 hover:bg-zinc-800'}`}
                        >      <p className="font-bold sm:text-base text-xs"> post </p>
                        </button>
                    </div>
                }

                { !commentReplyPostProps.isLoggedIn &&
                    <div className="mx-4 my-2 w-32 h-10 border rounded-lg duration-150 bg-zinc-900/50 hover:bg-zinc-900">
                        <Link href={`/blog/login?redirect=`+commentReplyPostProps.slug}>
                            <div className="flex items-center justify-center w-full h-full text-gray-300 hover:text-blue-500 duration-150">
                                <p className="font-bold sm:text-base text-xs">Login</p>
                            </div>
                        </Link> 
                    </div>
                }
            </div>
        </form>
    </div>
    )
}