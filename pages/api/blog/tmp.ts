import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';


const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_BASE_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.API_KEY;


export const config = {
    runtime: "edge",
};


export default async function GET(req: NextRequest): Promise<NextResponse>{

    try{
        const slug = req.nextUrl.searchParams.get('slug');
        const page = Number(req.nextUrl.searchParams.get("page")) || 1;
        let fetchedComments;

        if(slug && page){
            fetchedComments = await fetchComments(slug, page);
        }else{
            return new NextResponse("Invalid parameter", { status: 400 });
        }
        
        return NextResponse.json(fetchedComments);
    } catch(error) {
        console.error('Error fetching comments', error);
        return NextResponse.json({error: 'Error fetching comments'});
    }

}


export async function POST(req: NextRequest, res: NextResponse){

    try{
        if (req.method !== "POST") {
            return new NextResponse("use POST", { status: 405 });
        }

        const userId = req.nextUrl.searchParams.get('userId');
        const token = req.nextUrl.searchParams.get('token');
        const body = await req.json();
        let postedComment;

        if(userId && body && token){
            postedComment = await postComment(userId, token, body);
        }else{
            return new NextResponse("Invalid resource", { status: 400 });
        }
        
        return NextResponse.json(postedComment);
    } catch(error) {
        console.error('Error posting comment', error);
        return NextResponse.json({error: 'Error posting comment'});
    }
}


export async function DELETE(req: NextRequest, res: NextResponse){

    try{
        if (req.method !== "DELETE") {
            return new NextResponse("use POST", { status: 405 });
        }

        const userId = req.nextUrl.searchParams.get('userId');
        const commentId = req.nextUrl.searchParams.get('commentId');
        const token = req.nextUrl.searchParams.get('token');

        if(userId && commentId && token){
            await deleteComment(userId, commentId, token);
        }else{
            return new NextResponse("Invalid resource", { status: 400 });
        }
        
        return new NextResponse("", { status: 204 });
    } catch(error) {
        console.error('Error delete comment', error);
        return NextResponse.json({error: 'Error delete comment'});
    }
}


const axiosClient = axios.create({
    withCredentials: true,
    baseURL: BASE_URL
});


async function fetchComments(slug:string, page: number){
    const response = await axiosClient
    .get("/comment", {
        params:{
            slug,
            page
        }
    })
    .then(response=>response)
    .catch(err=>err);
    console.log("fetched comments")
    return response;
}


async function postComment(userId:string, token:string, body:JSON){
    const response = await axiosClient
    .post<ServerResponse<CommentResponse>>("/comment", {
        body:{
            body
        },
        params:{
            userId
        },
        headers:{
            'x-api-key': API_KEY,
            Authorization: "Bearer " + token
        },
    })
    .then(response=>response)
    .catch(err=>err);

    return response;
}
async function deleteComment(userId: string, commentId: string, token: string) {
    const response = await axiosClient
    .delete<ServerStatusResponse>("/comment", {
        params:{
            userId,
            commentId,
        },
        headers:{
            'x-api-key': API_KEY,
            Authorization: "Bearer " + token
        },
    })
    .then(response=>response)
    .catch(err=>err);

    return response;
}

