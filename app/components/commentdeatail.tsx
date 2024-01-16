import Image from "next/image";

type CommentProps = {
    comment: {
        content: string;
        createdAt: string;
        imgUrl: string;
        nickname: string;
    };
};
    
export default function CommentDetail({ comment }: CommentProps) {

    return (
        <div className="p-4 border rounded shadow bg-zinc-100">
            <div className="mx-8 mb-0 flex">
                <Image className="rounded-md border border-zinc-200" src={comment.imgUrl} alt={comment.nickname} width={50} height={50}/>
                <h3 className="mx-5 mt-12 text-base font-bold">{comment.nickname}
                </h3>
            </div>

            <div className="mx-8 mt-0">
            <div className="mt-0 mb-8 w-full h-px bg-gray-400" />

                    {comment.content}
                <div className="mt-8 w-full h-px bg-gray-400" />
            </div>
        <h4 className="mx-8 text-sm font-bold">{comment.createdAt.slice(0,16).replace("T","  ")} </h4>
        </div>
    )
}