import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const cookies = req.cookies;
  const currentPage = req.nextUrl.pathname;
  
  if(currentPage.includes('.jpg') || currentPage.includes('_') || currentPage.includes('api') ||
    currentPage.includes('.png') || currentPage.includes('.gif') || currentPage.includes('.svg') || currentPage.includes('.ico')
  ) 
    return NextResponse.next();

  const prevPage = cookies.get('currentPage')?.value;
  const res = NextResponse.next()
  res.cookies.set('currentPage', currentPage, {
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
    domain: 'chomanki.com',
    httpOnly: true,
    secure: true
  })
  if (prevPage && currentPage != prevPage) {
    res.cookies.set('prevPage', prevPage, {
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      domain: 'chomanki.com',
      httpOnly: true,
      secure: true
    })
  }

  return res;
}

export default middleware
