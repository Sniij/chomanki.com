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
  

export default function SlugLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900 md:font-GSans font-GSansLight">
			{children}
		</div>
	);
}