"use client";

import React, { useEffect, useState } from "react";
import { getCommentPageRequest, postCommentRequest, deleteCommentRequest, getUserProfile } from '@/service/blogservice'
import { getReplyPageRequest, postReplyRequest, deleteReplyRequest } from '@/service/blogservice'
import CommentDetail from '@/app/components/commentdetail'
import { useRouter } from 'next/navigation'
import { getCookie } from "cookies-next";
import CommentReplyDetail from "@/app/components/commentreplydetail";
import { CommentPost } from "@/app/components/commentpost";

export async function getUser(accessToken: string){
    const response = await getUserProfile(accessToken);
    
    return response; 
    
}
export default function Comment({ slug }: CommentProps) {
    const [commentList, setCommentList] = useState<Comment[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string>();
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [pageInfo, setPageInfo] = useState<PageInfo>({totalElements:0, totalPages:0});
    const router = useRouter();


    useEffect(() => {
        const fetchUser = async () => {
            if( accessToken ){
                const res = await getUser(accessToken);
                if(res.status === 200){
                    const user = {
                        userId: res.data.data.userId,
                        nickname: res.data.data.nickname,
                        imgUrl: res.data.data.imgUrl,
                        role: res.data.data.role,
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
        const result = await getCommentPageRequest(slug, page);

        if(result){
            if(result.status===200){
                const comments: Comment[] = result.data.data;
                const pageinfo: PageInfo = result.data.pageInfo;
                if(comments && Array.isArray(comments)){
                    if(isLoggedIn && userProfile){
                        setCommentList(comments.map(comment => ({
                            ...comment,
                            isMine: comment.user.userId === userProfile.userId ? true : false,
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
        
        if(accessToken && userProfile?.userId){
            let obj: CommentRequest = {
                slug: slug,
                content: content
            };
            const response = await postCommentRequest( obj, userProfile?.userId, accessToken );

            if (response.status === 201) {
                getCommentList(pageInfo.totalPages);
            } else {
                alert("작성에 실패하였습니다.");
            }
        }else{
            alert("작성에 실패하였습니다.");
        }
    }

    async function deleteComment(id: string){
        if(accessToken && userProfile?.userId){
            const response = await deleteCommentRequest(id, userProfile?.userId, accessToken);
            if (response.status === 204) {
                setCommentList(commentList.filter(comment => comment.id !== id));
            }else{
                alert("댓글 삭제를 실패하였습니다.");
            }
        }else{
            alert("댓글 삭제를 실패하였습니다.");
        }

    }

    async function postCommentReply(parent: string, content: string){
        
        if(accessToken && userProfile?.userId){
            let obj: CommentReplyRequest = {
                content: content
            };
            const response:ServerStatusResponse = await postReplyRequest(parent, userProfile.userId, obj, accessToken);
            return response;

        }else{
            return null;
        }
    }

    async function deleteCommentReply(commentId: string, replyId: string){
        // '/api/blog/comment/:commentId/:commentReplyId/:userId'

        if(accessToken && userProfile?.userId){
            const response:ServerStatusResponse = await deleteReplyRequest( commentId, userProfile.userId, replyId, accessToken);
            return response;
        }else{
            return null;
        }

    }


    async function getCommentReplyList(commentId: string, page: number){
        const result = await getReplyPageRequest(commentId, page);

        if(result){
            if(result.status===200){
                let commentReplyList: CommentReply[] = result.data.data;
                const info: PageInfo = result.data.pageInfo;

                if(commentReplyList && Array.isArray(commentReplyList)){
                    if(isLoggedIn && userProfile){
                        commentReplyList = commentReplyList.map(commentReply => ({
                            ...commentReply,
                            isMine: commentReply.user.userId === userProfile.userId ? true : false,
                            
                        }));
                    }else{
                        commentReplyList = commentReplyList.map(commentReply => ({
                            ...commentReply,
                            isMine: false,
                        }));
                    }

                    const commentsReplyResponse: CommentReplyResponse = {
                        commentReplies: commentReplyList,
                        pageInfo: info,
                    }
                    return commentsReplyResponse;
                }
            }
        }

        // data is empty
        return null;
    }

    async function getCommentReplies(commentId: string, page: number){
        const commentReplyList = await getCommentReplyList(commentId, page);

        return commentReplyList;
    }


    async function getUserProfileByComment(){
        if(userProfile) return userProfile;
        else return null;
    }



    return (
        <div className="text-sm sm:text-base text-gray-300 space-y-8">
            <div className="text-sm sm:text-xl font-bold"> Comments </div>
                <div className="space-y-4 ">
                    {commentList.map((comment) => (
                        <div key={comment.id}> 
                            <CommentDetail comment={comment} deleteComment={deleteComment}/>
                            <CommentReplyDetail 
                                commentId={comment.id} 
                                getCommentReplies={getCommentReplies} 
                                deleteCommentReply={deleteCommentReply} 
                                postCommentReplyProps={{ 
                                    slug: slug, 
                                    getUserProfileByComment: getUserProfileByComment, 
                                    postCommentReply:postCommentReply, 
                                    isLoggedIn: isLoggedIn, 
                                    parent: comment.id
                                }}
                            />
                        </div>
                        ))}
                    {commentList.length === 0 && 
                        <div className="p-4 rounded-lg duration-150 text-gray-300 bg-zinc-900 hover:bg-zinc-800/20">
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
                <CommentPost slug={slug} getUserProfileByComment={getUserProfileByComment} postComment={postComment} isLoggedIn={isLoggedIn} />
            </div>
        </div>
    );
}
