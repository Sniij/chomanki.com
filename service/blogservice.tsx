import axios from 'axios';


const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosClient2 = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

const axiosClient = axios.create({
    withCredentials: true,
});

interface CommentReplyRequest {
    content?: string;
}
interface CommentRequest {
    slug?: string;
    content?: string;
}
interface ServerResponse<T> {
	status: number;
	data: T;
}
interface RefreshResponse {
    accessToken?: string;
}
interface ServerStatusResponse {
	status: number;
}
interface UserProfile {
    id:string;
    nickname: string;
    imgUrl: string;
}
interface CommentResponse {
    id: string;
    slug: string;
    createdAt: string;
    content: string;
    user: UserProfile;
}
interface CommentReplyResponse {
    id: string;
    parent: string;
    createdAt: string;
    content: string;
    user: UserProfile;
}

export async function getPageRequest(URL: string, slug: string, page: number){
    const response = await axiosClient
    .get("/api/blog"+URL, {
        params:{
            slug,
            page
        }
    })
    .then(response=>response)
    .catch(err=>err);

    return response;
}

export async function postRequest(URI: string, payload: CommentRequest, userId: string, accessToken:string) {

    const response = await axiosClient
    .post<ServerResponse<CommentResponse>>("/api/blog" + URI + "/post/" + userId, payload,{
        headers:{
            Authorization: "Bearer " + accessToken
        }
    })
    .catch(err =>err)

    return response;
}


export async function deleteRequest(URI: string, commentId: string, userId: string, accessToken:string){

    const response = await axiosClient
    .delete<ServerStatusResponse>("/api/blog"+URI+ "/delete/"
    + commentId +"/"+ userId
    , {
        headers:{
            Authorization: "Bearer " + accessToken
        }
    })
    .catch(err =>err)

    return response;
}

// Blog Comment Reply
export async function getReplyPageRequest(URL: string, page: number){
    const response = await axiosClient
    .get(URL, {
        params:{
            page
        }
    })
    .then(response=>response)
    .catch(err=>err);

    return response;
}

export async function postReplyRequest(URI: string, payload: CommentReplyRequest, accessToken:string) {

    const response = await axiosClient
    .post<ServerResponse<CommentReplyResponse>>(URI, payload,{
        headers:{
            Authorization: "Bearer " + accessToken
        }
    })
    .catch(err =>err)

    return response;
}

export async function deleteReplyRequest(URI: string, userId:string, replyId:string, accessToken:string){
    // '/api/blog/comment/:commentId /:commentReplyId/:userId'
    const response = await axiosClient
    .delete<ServerStatusResponse>(URI+`/`+ replyId +`/`+ userId , {
        headers:{
            Authorization: "Bearer " + accessToken
        }
    })
    .catch(err =>err)

    return response;
}



export async function getUserProfile(accessToken: string){

    const response = await axiosClient
    .get<ServerResponse<UserProfile>>("/api/blog/user", {
        headers:{
            Authorization: "Bearer " + accessToken
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
            Refresh: refreshToken
        }
    })
    .then(response => response)
    .catch(err =>err)

    return response;
}