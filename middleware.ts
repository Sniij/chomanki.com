import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {

  const currentPage = req.nextUrl.pathname;
  
  if(currentPage.includes('.jpg') || currentPage.includes('_') || currentPage.includes('api') ||
    currentPage.includes('.png') || currentPage.includes('.gif') || currentPage.includes('.svg') || currentPage.includes('.ico')
  ) 
    return NextResponse.next();

  const prevPage = sessionStorage.getItem('currentPage');
  const res = NextResponse.next();

  sessionStorage.setItem('currentPage', currentPage);

  if (prevPage && currentPage != prevPage) {
    sessionStorage.setItem('prevPage', prevPage);
  }

  return res;
}

export default middleware
