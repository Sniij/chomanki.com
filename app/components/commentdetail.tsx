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
                <Image className="mt-3 sm:w-15 rounded-lg border border-zinc-100 text-gray-300" src={comment.imgUrl} alt={comment.nickname} width={30} height={40}/>
                <h3 className="duration-150 ml-5 mr-1 mt-5 sm:text-base text-sm text-gray-300 text-base font-bold hover:text-blue-500">{comment.nickname}
                </h3>
                <h6 className="duration-150 text-right text-zinc-500 ml-3 mb-0 mt-6 sm:text-xs text-xs font-bold hover:text-zinc-400">{"|  Created on "} {comment.createdAt.slice(0,16).replaceAll("T","  ").replaceAll("-",".")}{" |"}
                </h6>
                <h6 className="duration-150 text-right ml-1 mb-0 mt-6 text-xs font-bold ">
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
                </h6>
            </div>

            <div className="mx-8 mt-0 mb-5">
                    <div className="duration-150 text-zinc-400 text-base font-GSans hover:text-zinc-300 ">
                        {comment.content} 
                    </div>
            </div>


        </div>
    )
}