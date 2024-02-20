"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from 'next/navigation';
import { getPageRequest, postRequest, deleteRequest, getUserProfile } from '@/service/blogservice'
import CommentDetail from '@/app/components/commentdetail'
import Image from "next/image";
import { Card } from "@/app/components/card";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { getCookie, setCookie,deleteCookie } from "cookies-next";


type UserProfile = {
    id:string;
    nickname: string;
    imgUrl: string;
}

interface CommentProps {
    slug: string;
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

interface PageInfo {
    totalElements: number;
    totalPages: number;
}

interface CommentRequest {
    slug?: string;
    content?: string;
}

export async function getUser(accessToken: string){
    const response = await getUserProfile(accessToken);
    
    return response; 
    
}
export default function Comment({ slug }: CommentProps) {
    const [commentList, setCommentList] = useState<Comment[]>([]);
    const [content, setContent] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string>();
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [pageInfo, setPageInfo] = useState<PageInfo>({totalElements:0, totalPages:0});
    const router = useRouter();

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight+30}px`;
        }
    }, [content]);


    useEffect(() => {


        const fetchUser = async () => {

            if( accessToken ){
                const res = await getUser(accessToken);
                if(res.status === 200){
                    const user = {
                        id: res.data.data.userId,
                        nickname: res.data.data.nickname,
                        imgUrl: res.data.data.imgUrl,
                    };
                    setUserProfile(user);
                    setIsLoggedIn(true);

                }else{
                    alert("로그인 정보가 만료되었습니다. 로그인 화면으로 넘어갑니다.");
                    router.push("/blog/login")
                }
            }
        };
        
        fetchUser();
    }, [accessToken]);


    useEffect(() => {
        const accesstoken = getCookie("accessToken") ?? "";
        if(accesstoken) setAccessToken(accesstoken);
        getCommentList(page);
    }, [page,isLoggedIn]);

    const renderingPage = () => {
        const result  = [];
        for(let i = 1; i <= pageInfo.totalPages; i++){
            if(i===page){
            result.push(
                <button key={i} onClick={() => setPage(i)}
                    className="duration-150"
                    disabled
                >
                    <div 
                    className="text-blue-500 border rounded-md w-7 h-7">
                        <p className="mt-1 text-sm ">{i}</p>
                    </div>
                </button>
                )}
            else{
                result.push(
                    <button key={i} onClick={() => setPage(i)}
                        className="duration-150"
                    >
                        <div 
                        className=" border rounded-md border-zinc-600 w-7 h-7">
                            <p className="mt-1 text-sm ">{i}</p>
                        </div>
                    </button>
                    )
            }
        }
        return result;
    }

    
    async function getCommentList(page: number){
        const result = await getPageRequest(`/comment`, slug, page);
        if(result){
            if(result.status===200){
                const comments: Comment[] = result.data.data;
                const pageinfo: PageInfo = result.data.pageInfo;

                if(comments && Array.isArray(comments)){
                    if(isLoggedIn && userProfile){
                        setCommentList(comments.map(comment => ({
                            ...comment,
                            isMine: comment.userId === userProfile.id ? true : false,
                        })));
                    }else{
                        setCommentList(comments.map(comment => ({
                            ...comment,
                            isMine: false
                        })));
                    }
                    setPageInfo(pageinfo);
                }
            }
        }else{
            alert("댓글 불러오기를 실패하였습니다.");
        }
    }

    async function postComment(content: string){
        
        if(accessToken && userProfile?.id){
            let obj: CommentRequest = {
                slug: slug,
                content: content
            };
            const response = await postRequest(`/comment`, obj, userProfile?.id, accessToken );

            if (response.status === 201) {
                const comment:Comment = {
                    id: response.data.data.id,
                    slug: response.data.data.slug,
                    content: response.data.data.content,
                    createdAt: response.data.data.createdAt,
                    isMine: true,
                    userId: response.data.data.userId,
                    imgUrl: response.data.data.imgUrl,
                    nickname: response.data.data.nickname
                };
                setContent("");
                //router.push(`/blog/`+slug+`page=`+page);
                commentList.push(comment);
                setCommentList(commentList);
            } else {
                alert("작성에 실패하였습니다.");
            }
        }else{
            alert("작성에 실패하였습니다.");
        }
    }

    async function deleteComment(id: string){
        if(accessToken && userProfile?.id){
            const response = await deleteRequest(`/comment`, id, userProfile?.id, accessToken);
            if (response.status === 204) {
                setCommentList(commentList.filter(comment => comment.id !== id));
            }else{
                alert("댓글 삭제를 실패하였습니다.");
            }
        }else{
            alert("댓글 삭제를 실패하였습니다.");
        }

    }


    return (
        <div className="text-gray-300 space-y-8">
            <div className="text-xl font-bold"> Comments </div>
                <div className="space-y-4 ">
                    {commentList.map((comment) => (
                            <CommentDetail key={comment.id} comment={comment} deleteComment={deleteComment}/>
                        ))}
                    {commentList.length === 0 && 
                                <div className="p-4 rounded-lg duration-150 bg-zinc-900/50 text-gray-300 hover:bg-zinc-900">
                                <div className="flex flex-col items-center">
                                    <p className=" duration-150 hover:text-blue-500"> 첫번째 댓글을 남겨주세요 :) </p>
                                </div>
                            </div>
                    }
                </div>
                    <div className="flex justify-center gap-3">
                    <button onClick={() => setPage(page - 1)}
                            disabled={page===1 || pageInfo.totalPages===0}  
                            className={`${page===1 || pageInfo.totalPages===0 ? 'text-zinc-400':'duration-150 hover:text-blue-500'}`}
                    >
                        Prev 
                    </button>
                        <div className="flex justify-center gap-3">
                                {renderingPage()
                                .map(component=>(
                                    <div key={component.key}
                                        className="lg:hover:scale-105 transition-transform ease-in-out duration-300 rounded-md bg-zinc-800/50 hover:bg-zinc-800 hover:text-blue-500"
                                    >
                                        {component}
                                    </div>
                                ))
                                
                                }
                        </div>
                    <button onClick={() => setPage(page + 1)}
                            disabled={page===pageInfo.totalPages || pageInfo.totalPages===0}  
                            className={`${page===pageInfo.totalPages || pageInfo.totalPages===0 ? 'text-zinc-400':'duration-150 hover:text-blue-500'}`}
                    > 
                        Next 
                    </button>
                    </div>
                <div>
                <div className="relative duration-150 p-4 rounded-lg bg-zinc-900/50 text-gray-300 hover:bg-zinc-900">
                    <div className="flex text-gray-300 my-4 ml-8 font-bold font-GSans tracking-tight sm:text-xl font-display">
                        Post comment  
                    </div>
                    { isLoggedIn && userProfile &&
                            <div className="mx-8 flex">
                            <h4 className="mr-5 mt-3 text-gray-300 text-sm font-bold"> {" Current Account | "} </h4>
                            <Image className="mt-1 text-gray-300 rounded-lg border border-zinc-200" src={userProfile.imgUrl} alt={userProfile.nickname} width={25} height={25}/>
                            <h4 className="duration-150 mt-2 mx-3 text-gray-300 text-base font-bold hover:text-blue-500">{userProfile.nickname} </h4>
                            </div>
                    }

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if(typeof window !== 'undefined') {
                            if(window.confirm("댓글을 작성하시겠습니까?")) {
                                postComment(content);
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
                            className="w-full min-h-32 bg-zinc-900/50 hover:bg-zinc-900 text-gray-300 break-words text-ellipsis overflow-hidden flex-grow h-32 p-2 border rounded-lg resize-y"
                            disabled={!isLoggedIn}  
                        />
                        <div className="flex mx-6 w-full">
                        <p className="text-xs">{`${content.length}/500`}</p>
                        { isLoggedIn &&
                        <div className="absolute bottom-3 right-10 w-32 h-10 border rounded-lg duration-150 bg-zinc-900/50 hover:bg-zinc-900">
                        <button
                        type="submit"
                        disabled={!content.trim()}
                        className={`flex items-center justify-center h-full w-full border rounded-lg  ${!content.trim() ? 'bg-zinc-900/50 text-gray-600' : 'bg-zinc-900/50 text-blue-500 hover:bg-zinc-800'}`}
                        >      <p className="font-bold sm:text-base text-xs"> post </p>
                        </button></div>
                        }
                        { !isLoggedIn &&
                            <div className="absolute bottom-3 right-10 w-32 h-10 border rounded-lg duration-150 bg-zinc-900/50 hover:bg-zinc-900">
                            <Link href={`/blog/login?redirect=`+slug}>
                                <div className="flex items-center justify-center w-full h-full text-gray-300 hover:text-blue-500 duration-150">
                                    <p className="font-bold sm:text-base text-xs">Login</p>
                                </div>
                            </Link> 
                            </div>
                        }
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
