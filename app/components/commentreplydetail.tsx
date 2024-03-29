"use client";

import Image from "next/image";
//import CommentReplyPost from "@/app/components/commentpost"
import React, { useState } from "react";
import { CommentReplyPost } from "@/app/components/commentpost";
    
export default function CommentReplyDetail( {commentId, getCommentReplies, deleteCommentReply, postCommentReplyProps} : CommentReplyProps) {
    const [page, setPage] = useState<number>(1);
    const [commentReplyList, setCommentReplyList] = useState<CommentReply[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo>({totalElements:0, totalPages:0});
    const [visible, setVisible] = useState<boolean>(false);

    async function handleCommentReplyList() {
        // getResponse: CommentReplyResponse | null
        const getResponse = await getCommentReplies(commentId, page);

        if(getResponse){
            const newReplies: CommentReply[] = getResponse.commentReplies;
            setCommentReplyList(prev => prev ? [...prev, ...newReplies] : newReplies);
        
            const info: PageInfo = getResponse.pageInfo;
            setPageInfo(info)
        }
        setPage(prevPage => prevPage + 1);
        setVisible(true);
    }
    async function handleRefreshReplies() {
        const getResponse = await getCommentReplies(commentId, page-1);
        if(getResponse){
            const newReplies: CommentReply[] = getResponse.commentReplies;
            setCommentReplyList(newReplies);
        }
    }


    async function handleDeleteCommentReply(replyId: string) {
        // getResponse: CommentReplyResponse | null
        const response = await deleteCommentReply(commentId, replyId);

        if(response){
            if (response.status === 204) {
                setCommentReplyList(commentReplyList.filter(reply => reply.id !== replyId));
            }else{
                alert("댓글 삭제를 실패하였습니다.");
            }
        }else{
            alert("댓글 삭제를 실패하였습니다.");
        }
    }

    return (
        <div className="my-2 mx-10 text-gray-300 text-xs ">
            <button 
                onClick={handleCommentReplyList}
                disabled={visible}  
                className={`${visible ? 'hidden': "mx-2 my-2 text-sm duration-150 text-gray-300 hover:text-blue-500 right" }`}
            >
            Reply ▼
            </button>
            <div className={`${!visible ? 'hidden' : "space-y-2 "}`}>
                {commentReplyList.map((commentReply) => (
                <div key={commentReply.id} className="py-3 rounded-lg duration-150 bg-zinc-900 hover:bg-zinc-800/20"> 
                    <div className="justify-start md:mx-8 mx-3 mb-1 flex text-pretty">
                        <Image className="mt-3 rounded-lg border border-zinc-100 text-gray-300 w-5 sm:w-6" 
                        src={commentReply.user.imgUrl} alt={commentReply.user.nickname} width={30} height={40}
                        />
                        <h6 className="duration-150 ml-3 mr-1 mt-4 sm:text-sm text-xs text-gray-300 text-sm font-bold hover:text-blue-500 text-nowrap ">
                            {commentReply.user.nickname}
                        </h6>
                        <h6 className="duration-150 text-right text-zinc-500 ml-3 mb-0 mt-5 text-xs font-bold hover:text-zinc-400">
                            {(
                                <time dateTime={new Date(commentReply.createdAt).toISOString()}>
                                    {Intl.DateTimeFormat("en-US", { 
                                        dateStyle: "medium",
                                        timeStyle: "short"
                                    }).format(new Date(commentReply.createdAt))}
                                </time>
                            )}
                        </h6>
                        <h6 className="duration-150 text-right ml-1 mb-0 mt-5 text-xs font-bold ">
                            {commentReply.isMine && (
                                <button className="duration-150 text-blue-500 hover:text-blue-300 ml-3 right"
                                onClick={ e => {
                                    e.preventDefault();
                                    if(typeof window !== 'undefined') {
                                        if(window.confirm("댓글을 삭제하시겠습니까?")) {
                                            handleDeleteCommentReply(commentReply.id);
                                        }
                                    }
                                }}>
                                    del
                                </button> 
                            )}
                        </h6>
                        </div>
                        <div className="mx-8 mt-0 mb-5">
                            <div className="duration-150 text-zinc-400 text-sm md:font-bold font-thin hover:text-zinc-300 text-balance ">
                                {commentReply.content} 
                            </div>
                        </div>
                    
                </div>
                ))}
                <div>
                    <button                 
                            onClick={handleCommentReplyList}
                            disabled={pageInfo.totalPages<page}  
                            className={`${pageInfo.totalPages<page ? 'hidden': "my-4 mx-10 text-sm duration-150 text-gray-300 hover:text-blue-500 right" }`}                    
                    >
                        More reply ▼
                    </button>               
                </div>

                <CommentReplyPost  slug={postCommentReplyProps.slug} getUserProfileByComment={postCommentReplyProps.getUserProfileByComment} postCommentReply={postCommentReplyProps.postCommentReply} isLoggedIn={postCommentReplyProps.isLoggedIn} parent={postCommentReplyProps.parent} refreshReplies={handleRefreshReplies}/>
            </div>

            
        </div>
    )
}