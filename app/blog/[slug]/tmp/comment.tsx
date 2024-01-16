type CommentProps = {
comment: {
    id: string;
    user: string;
    content: string;
};
};

export default function Comment({ comment }: CommentProps) {
return (
    <div className="p-4 border rounded shadow bg-zinc-100">
    <h3 className="mx-10 my-3 text-sm font-bold">{comment.user}
    <div className="mt-1 mb-8 w-full h-px bg-gray-400" />
    </h3>
    <p className="mx-10 mb-8 ">{comment.content}</p>
    </div>
)
}