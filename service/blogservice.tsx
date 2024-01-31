import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8080",
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

    const response = await axiosInstance.get(URL, {
        params:{
            slug,
            page
        }
    })
    .then(response=>response)
    .catch(err=>console.error(err));

    return response;
}

export async function postRequest(URI: string, payload: CommentRequest) {

    const response = await axiosInstance
    .post<ServerResponse<CommentResponse>>(URI, payload,{

    }   
    )
    .catch(err =>err)

    return response;
}


export async function deleteRequest(URI: string, commentId: string){

    const response = await axiosInstance
    .delete<ServerStatusResponse>(URI, {
        params:{
            commentId: commentId
        },

    })
    .catch(err =>err)

    return response;
}

export async function getUserProfile(accessToken: string){

    setCookie("accessToken", accessToken);

    const response = await axiosInstance
    .get<ServerResponse<UserProfile>>("/user",{
    })
    .then(response => response)
    .catch(err =>err)

    return response;
}