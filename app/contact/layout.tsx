import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: {
	  default:"chomanki.com",
	  template: "contact | chomanki.com"
	},
	description: 'Backend Developer Manki Cho',
	icons: {
	  shortcut: "/favicon.ico",
	},
  }
  

export default function ContactLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900 ">
			{children}
		</div>
	);
}