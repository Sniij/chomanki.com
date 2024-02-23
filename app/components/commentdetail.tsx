import Image from "next/image";

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

    comment.createdAt = comment.createdAt.slice(0,16).replaceAll("T","  ").replaceAll("-",".");
    const options = {
        year: "2-digit",
        month: "short",
        weekday: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false
    }

    return (
        <div className="p-4 rounded-lg duration-150 bg-zinc-900/50 text-gray-300 hover:bg-zinc-900">
            <div className="justify-start md:mx-8 mx-3 mb-0 flex text-pretty ">
                <Image className="mt-3 rounded-lg border border-zinc-100 text-gray-300 w-6 sm:w-7" 
                    src={comment.imgUrl} alt={comment.nickname} width={30} height={40}
                />
                <h6 className="duration-150 ml-3 mr-1 mt-4 sm:text-base text-sm text-gray-300 text-base font-bold hover:text-blue-500 text-nowrap ">
                    {comment.nickname}
                </h6>
                <h6 className="duration-150 text-right text-zinc-500 ml-3 mb-0 mt-5 text-xs font-bold hover:text-zinc-400">
                    {(
                        <time dateTime={new Date(comment.createdAt).toISOString()}>
                            {Intl.DateTimeFormat("en-US", { 
                                dateStyle: "medium",
                                timeStyle: "short"
                            }).format(new Date(comment.createdAt))}
                        </time>
                    )}
                </h6>
                <h6 className="duration-150 text-right ml-1 mb-0 mt-5 text-xs font-bold ">
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
                <div className="duration-150 text-zinc-400 text-sm sm:text-sm md:font-bold font-thin hover:text-zinc-300 text-balance ">
                    {comment.content} 
                </div>
            </div>


        </div>
    )
}