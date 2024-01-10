import axios, { AxiosResponse } from 'axios';

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1"
});


export async function getRequest(URI: string): Promise<AxiosResponse | undefined> {
    try {
        const response = await axiosClient.get(URI);
        return response;
    } catch (err) {
        console.error(err);
    }
}

export async function getPageRequest(URL: string, page: number, size: number): Promise<AxiosResponse | undefined> {
    try {
        const response = await axiosClient.get(URL, {
            params:{
                page,
                size
            }
        });

        return response;
    } catch (err) {
        console.error(err);
    }
}

export async function postRequest(URI: string, payload: JSON): Promise<AxiosResponse | undefined> {
    try {
        const response = await axiosClient.post(URI, payload);
        return response;
    } catch (err) {
        console.error(err);
    }
}

export async function deleteRequest(URI: string): Promise<AxiosResponse | undefined> {
    try {
        const response = await axiosClient.delete(URI);
        return response;
    } catch (err) {
        console.error(err);
    }
}

export async function patchRequest(URI: string, payload: JSON): Promise<AxiosResponse | undefined> {
    try {
        const response = await axiosClient.patch(URI, payload);
        return response;
    } catch (err) {
        console.error(err);
    }
}
