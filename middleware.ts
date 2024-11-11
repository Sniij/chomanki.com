import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {

    if( request.nextUrl.pathname.startsWith('/auth/login/')){
        const API_KEY = process.env.API_KEY;

        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-api-key', API_KEY?API_KEY:"")
        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
        response.headers.set('x-api-key', API_KEY?API_KEY:"")
        return response
    }
  
}