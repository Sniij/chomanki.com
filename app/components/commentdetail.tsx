import Image from "next/image";

type UserProfile = {
    id:string;
    nickname: string;
    imgUrl: string;
}

type CommentProps = {
    comment: {
        id: string;
        content: string;
        createdAt: string;
        userId: string;
        imgUrl: string;
        nickname: string;
        isMine: boolean;
    };
    deleteComment: (id: string) => void;
};
    
export default function CommentDetail({ comment, deleteComment }: CommentProps) {

    return (
        <div className="p-4 rounded-lg duration-150 bg-zinc-900/50 text-gray-300 hover:bg-zinc-900">
            <div className="justify-start mx-8 mb-0 flex ">
                <div className="duration-150 mt-3 w-7 h-7 rounded-lg bg-blue-500 opacity-80 hover:opacity-100">
                <Image className="mt-auto rounded-lg border border-zinc-100 text-gray-300" src={comment.imgUrl} alt={comment.nickname} width={30} height={40}/>
                </div>
                <h4 className="duration-150 mx-5 mt-5 text-gray-300 text-base font-bold hover:text-blue-500">{comment.nickname}
                </h4>
                <h4 className="duration-150 text-right text-zinc-500 ml-3 mb-0 mt-6 text-xs font-bold hover:text-zinc-400">{"|  Created on "} {comment.createdAt.slice(0,16).replaceAll("T","  ").replaceAll("-",".")}{" |"}
                </h4><h4 className="duration-150 text-right mx-1 mb-0 mt-6 text-xs font-bold ">
                {comment.isMine && (
                    <button className="duration-150  text-blue-500 hover:text-blue-300 ml-3 right"
                    onClick={ e => {
                        e.preventDefault();
                        if(typeof window !== 'undefined') {
                            if(window.confirm("댓글을 삭제하시겠습니까?")) {
                                deleteComment(comment.id)
                            }
                        }
                    }}>
                        del
                    </button> 
                )}
                </h4>
            </div>

            <div className="mx-8 mt-0 mb-5">
                    <div className="duration-150 text-zinc-400 text-base font-GSans hover:text-zinc-300 ">
                        {comment.content} 
                    </div>
            </div>


        </div>
    )
}