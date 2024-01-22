import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8080",
    withCredentials: true,
});


interface CommentRequest {
    slug?: string;
    content?: string;
}

export async function getRequestBlog(URI: string){
    const response = await axiosClient.get(URI)
    .then(response=>response.data)
    .catch(err=>console.error(err));

    return response;
}

export async function getPageRequest(URL: string, slug: string, page: number){

    const response = await axiosClient.get(URL, {
        params:{
            slug,
            page
        }
    })
    .then(response=>response.data.data)
    .catch(err=>console.error(err));

    return response;
}

export async function postRequest(URI: string, payload: CommentRequest) {

    const response = await axiosInstance.post(URI, payload)
    .then(response => response)
    .catch(error => console.error(error));

    return response;
}


export async function deleteRequest(URI: string, commentId: string){

    const response = await axiosInstance.delete(URI, {
        params:{
            commentId: commentId
        }
    })
    .then(response=>response)
    .catch(err=>console.error(err));

    return response;

}

export async function loginRequest(URI: string, request: string){

    const response = await axiosClient.get(URI, {
        headers: {
            'requesturl': request
        }
    })
    .then(response=>response)
    .catch(err=>console.error(err));
    return response;
}

export async function getUserProfile(jsessionid: string){
    const response = await axiosInstance
    .get("/")
    .then(response=>response.data.data)
    .catch(err=>console.error(err));

    return response;
}