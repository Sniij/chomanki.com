import "../globals.css";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "chomanki.com",
    template: "%s | chomanki.com",
  },
  description: "chomanki",
  icons: {
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <head>
      </head>
      <body
        className={`bg-black" : undefined
          }`}
      >
        {children}
      </body>
    </html>
  );
}
