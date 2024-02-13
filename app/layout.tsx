import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: {
    default:"chomanki.com",
    template: "%s | chomanki.com"
  },
  description: 'Backend Developer Manki Cho',
  icons: {
    shortcut: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
