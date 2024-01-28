"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { cookies } from 'next/headers'
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'


type UserProfile = {
    id:string;
    nickname: string;
    imgUrl: string;
}


export default function Navigation() {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const searchParams = useSearchParams();
	const [accessToken, setAccessToken] = useState<string>();
	const [refreshToken, setRefreshToken] = useState<string>();
	const router = useRouter();


	useEffect(()=>{

		if(accessToken){
			setCookie("accessToken",accessToken);
		}
		if(refreshToken){
			setCookie("refreshToken",refreshToken);
		}
		if(accessToken && refreshToken)
			router.push(window.location.pathname);

		
	},[accessToken, refreshToken])


	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);
		if(searchParams){
			const searchAccessToken = searchParams.get('accessToken');
			const searchRefreshToken = searchParams.get('refreshToken');

			if(searchAccessToken)
				setAccessToken(searchAccessToken);
			if(searchRefreshToken)
				setRefreshToken(searchRefreshToken);

		}

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header ref={ref}>
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
					isIntersecting
						? "bg-zinc-900/0 border-transparent"
						: "bg-zinc-900/500  border-zinc-700 "
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						<Link
							href="/blog"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Blog
						</Link>
						<Link
							href="https://www.chomanki.com"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Portfolio
						</Link>
						<Link
							href="/contact"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Contact
						</Link>
						<Link
							href="/"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Logout
						</Link>
					</div>

					<Link
						href="/"
						className="duration-200 text-zinc-300 hover:text-zinc-100"
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>
				</div>
			</div>
		</header>
	);
};
