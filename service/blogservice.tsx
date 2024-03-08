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
    userId:string;
    nickname: string;
    imgUrl: string;
}

interface CommentResponse {
    id: string;
    slug: string;
    createdAt: string;
    content: string;
    nickname: string;
    imgUrl: string;
    userId: string;
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