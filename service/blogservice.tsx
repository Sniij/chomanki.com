import axios from 'axios';


const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.API_KEY;

const axiosClient2 = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

const axiosClient = axios.create({
    withCredentials: true,
});

export async function getCommentPageRequest(slug: string, page: number){
    
    const response = await axiosClient
    .get("/api/blog/comment", {
        params:{
            slug,
            page
        },
        headers:{
            "x-api-key": API_KEY,
        }
    })
    .then(response=>response)
    .catch(err=>err);

    return response;
}

export async function postCommentRequest(payload: CommentRequest, userId: string, accessToken:string) {

    const response = await axiosClient
    .post<ServerResponse<CommentResponse>>("/api/blog/comment/post/" + userId, payload,{
        headers:{
            "x-api-key": API_KEY,
            Authorization: "Bearer " + accessToken
        }
    })
    .catch(err =>err)

    return response;
}


export async function deleteCommentRequest(commentId: string, userId: string, accessToken:string){

    const response = await axiosClient
    .delete<ServerStatusResponse>("/api/blog/comment/delete/"+ commentId +"/"+ userId, {
        headers:{
            "x-api-key": API_KEY,
            Authorization: "Bearer " + accessToken
        }
    })
    .catch(err =>err)

    return response;
}

// Blog Comment Reply
export async function getReplyPageRequest(commentId: string, page: number){
    const response = await axiosClient
    .get("/api/blog/comment/"+commentId, {
        params:{
            page
        },
        headers:{
            "x-api-key": API_KEY
        }
    })
    .then(response=>response)
    .catch(err=>err);

    return response;
}

export async function postReplyRequest(commentId: string, userId: string, payload: CommentReplyRequest, accessToken:string) {

    const response = await axiosClient
    .post<ServerResponse<CommentReplyResponse>>("/api/blog/comment/" + commentId + "/" + userId, payload,{
        headers:{
            Authorization: "Bearer " + accessToken,
            "x-api-key": API_KEY
        }
    })
    .catch(err =>err)

    return response;
}

export async function deleteReplyRequest(commentId: string, userId:string, replyId:string, accessToken:string){
    // '/api/blog/comment/:commentId /:commentReplyId/:userId'
    const response = await axiosClient
    .delete<ServerStatusResponse>("/api/blog/comment/" + commentId +`/`+ replyId +`/`+ userId , {
        headers:{
            Authorization: "Bearer " + accessToken,
            "x-api-key": API_KEY
        }
    })
    .catch(err =>err)

    return response;
}



export async function getUserProfile(accessToken: string){

    const response = await axiosClient
    .get<ServerResponse<UserProfile>>("/api/blog/user", {
        headers:{
            Authorization: "Bearer " + accessToken,
            "x-api-key": API_KEY
        }
    })
    .then(response => response)
    .catch(err =>err)

    return response;
}


export async function getAccessTokenByRefreshToken(refreshToken: string){

    const response = await axiosClient
    .get<ServerResponse<RefreshResponse>>("/api/blog/auth/refresh", {
        headers:{
            Refresh: refreshToken,
            "x-api-key": API_KEY
        }
    })
    .then(response => response)
    .catch(err =>err)

    return response;
}