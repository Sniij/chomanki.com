import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LocalFont from "next/font/local";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});
export const metadata: Metadata = {
  title: {
    default:"chomanki.com",
    template: "chomanki.com | %s"
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
    <html lang="ko" className={[inter.variable, calSans.variable].join(" ")}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
