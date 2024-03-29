// Commons
interface PageInfo {
    totalElements: number;
    totalPages: number;
}


// 통신 관련
interface ServerResponse<T> {
	status: number;
	data: T;
}
interface ServerStatusResponse {
	status: number;
}



// 보안 관련
interface RefreshResponse {
    accessToken?: string;
}

// User 관련
interface UserProfile {
    userId:string;
    nickname: string;
    imgUrl: string;
    role: string;
}


// Comment 관련
interface Comment {
    id: string;
    slug: string;
    content: string;
    createdAt: string;
    isMine: boolean;
    user: UserProfile;
}
interface CommentRequest {
    slug?: string;
    content?: string;
}
interface CommentProps {
    slug: string;
}
interface CommentRequest {
    slug?: string;
    content?: string;
}
interface CommentResponse {
    id: string;
    slug: string;
    createdAt: string;
    content: string;
    user: UserProfile;
}

interface CommentPostProps {
    getUserProfileByComment: () => Promise<UserProfile | null>;
    postComment: (content: string) => Promise<void>;
    slug: string;
    isLoggedIn: boolean;
}
interface CommentDetailProps {
    comment: {
        id: string;
        content: string;
        createdAt: string;
        isMine: boolean;
        user: UserProfile;
    };
    deleteComment: (id: string) => void;
};


// Comment Reply 관련
interface CommentReply {
    id: string;
    parent: string;
    createdAt: string;
    content: string;
    isMine: boolean;
    user: UserProfile;
}
interface CommentReplyResponse {
    commentReplies: CommentReply[];
    pageInfo: PageInfo;
}
interface CommentReplyRequest {
    content?: string;
}

/***
 * interface CommentReplyResponse {
    id: string;
    parent: string;
    createdAt: string;
    content: string;
    user: UserProfile;
}*
*/

interface CommentReplyPostProps {
    getUserProfileByComment: () => Promise<UserProfile | null>;
    postCommentReply: (parent: string, content: string) => Promise<ServerStatusResponse | null>;
    refreshReplies: () => Promise<void>;
    slug: string;
    isLoggedIn: boolean;
    parent: string;
}

interface CommentReplyProps {
    commentId: string;
    getCommentReplies: (commentId:string, page: number) => Promise<CommentReplyResponse | null>;
    deleteCommentReply: (id: string, replyId:string) => Promise<ServerStatusResponse | null>;
    postCommentReplyProps: PostCommentReplyProps;
};




