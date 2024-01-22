"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from 'next/navigation';
import { getPageRequest, postRequest, deleteRequest, getUserProfile } from '@/service/blogservice'
import CommentDetail from '../components/commentdeatail'
import Image from "next/image";

type UserProfile = {
    id:string;
    nickname: string;
    imgUrl: string;
}

interface CommentProps {
    slug: string;
    jsessionid: string;
}

interface Comment {
    id: string;
    slug: string;
    content: string;
    createdAt: string;
    isMine: boolean;
    userId: string;
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
async function getUser(jsessionid: string): Promise<UserProfile> {
    const response = await getUserProfile(jsessionid);
    const imgUrl:string = response.imgUrl;
    const nickname:string = response.nickname;
    const id:string = response.userId;
    console.log(response);
    let obj:UserProfile = {
        id: id,
        nickname: nickname,
        imgUrl: imgUrl
    }

    return obj; 
}
export default function Comment({ slug, jsessionid }: CommentProps) {
    const [commentList, setCommentList] = useState<Comment[]>([]);
    const [content, setContent] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile>({imgUrl: '', nickname:'', id:''});

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight+30}px`;
      }
    }, [content]);

    useEffect(() => {
        refreshIsLogedIn();
    }, [page]);

    async function refreshIsLogedIn(){
        if(jsessionid){
            setIsLoggedIn(true);
            const user = await getUser(jsessionid);
            if(user)
                setUserProfile(user);
        }else{
            setIsLoggedIn(false);
        }

        await getCommentList(page);
    }

    
    async function getCommentList(page: number){
        const comments = await getPageRequest(`/comment`, slug, page);
        console.log(comments);
        if (comments && Array.isArray(comments)) {
            if(jsessionid){
                const user = await getUser(jsessionid);
                setCommentList(comments.map(comment => ({
                    ...comment,
                    isMine: comment.userId === user.id ? true : false
                })));
            }else{
                setCommentList(comments.map(comment => ({
                    ...comment,
                    isMine: false
                })));
            }

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


    const pathname = usePathname();
    const loginUrl = `http://localhost:8080/V1login`;

    return (
        <div className="space-y-8">
            <div className="text-xl font-bold"> Comments </div>
                <div className="space-y-4">
                    {commentList.map((comment) => (
                            <CommentDetail key={comment.id} comment={comment} deleteComment={deleteComment}/>
                        ))}
                </div>
                <div>
                <div className="p-4 border rounded shadow bg-zinc-100">
                    <h3 className="my-4 ml-8 font-bold font-GSans tracking-tight sm:text-xl font-display flex">Post Comment  
                    </h3>
                    <div className="mx-8 mt-0 mb-3 w-100 h-px bg-gray-400" />

                { isLoggedIn &&
                        <div className="mx-8 mb-0 flex">
                        <Image className="mt-1 mb-5 rounded-md border border-zinc-200" src={userProfile.imgUrl} alt={userProfile.nickname} width={40} height={40}/>
                                <h3 className="mx-5 mt-5 text-base font-bold">{userProfile.nickname}
                                </h3>
                            </div>
                }

            <form onSubmit={(e) => postComment(content)} className="flex mx-8 space-x-4">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-9/12 break-words text-ellipsis overflow-hidden flex-grow h-32 p-2 border rounded shadow resize-y"
                        disabled={!isLoggedIn}
                    />
                    { isLoggedIn &&
                    <button
                    type="submit"
                    disabled={!content.trim() || !isLoggedIn}
                    className={`h-20 rounded shadow hover:bg-gray-700 ${!content.trim() ? 'bg-gray-700 text-gray-500' : 'bg-gray-600 text-white'}`}
                    >      <p className=" mx-10"> 작성 </p>
                    </button>
                     }
                    { !isLoggedIn &&
                    <a 
                    href={loginUrl+`?requesturl=http://localhost:3000${pathname}`}
                    >
                        <Image className="my-auto rounded shadow hover:bg-gray-300" src='/signingoogle_sq.png' alt="sign in with Google" width={100} height={100}/>
                    </a>
                     }
                </form>
        </div>
    

                
                    <button onClick={() => setPage(page - 1)}> Previous </button>
                    <button onClick={() => setPage(page + 1)}> Next </button>
                </div>
        </div>
    );
}
