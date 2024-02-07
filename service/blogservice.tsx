import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';


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
    console.log(URL)
    const response = await axiosInstance.get(URL, {
        params:{
            slug,
            page
        }
    })
    .then(response=>response)
    .catch(err=>err);

    return response;
}

export async function postRequest(URI: string, payload: CommentRequest, userId: string,accessToken:string) {

    const response = await axiosInstance
    .post<ServerResponse<CommentResponse>>(URI, payload,{
        params:{
            userId: userId
        },
        headers:{
            Authorization: "Bearer " + accessToken
        }
    })
    .catch(err =>err)

    return response;
}


export async function deleteRequest(URI: string, commentId: string, userId: string, accessToken:string){

    const response = await axiosInstance
    .delete<ServerStatusResponse>(URI, {
        params:{
            commentId: commentId,
            userId: userId
        },
        headers:{
            Authorization: "Bearer " + accessToken
        }
    })
    .catch(err =>err)

    return response;
}

export async function getUserProfile(accessToken: string){

    const response = await axiosInstance
    .get<ServerResponse<UserProfile>>("/user", {
        headers:{
            Authorization: "Bearer " + accessToken
        }
    })
    .then(response => response)
    .catch(err =>err)

    return response;
}


export async function getAccessTokenByRefreshToken(refreshToken: string){

    const response = await axiosInstance
    .get<ServerResponse<RefreshResponse>>("/auth/refresh", {
        headers:{
            Refresh: refreshToken
        }
    })
    .then(response => response)
    .catch(err =>err)

    return response;
}