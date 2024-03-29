"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import { getAccessTokenByRefreshToken } from '@/service/blogservice'

export default function Navigation() {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const searchParams = useSearchParams();
	const [accessToken, setAccessToken] = useState<string>();
	const [refreshToken, setRefreshToken] = useState<string>();
	const router = useRouter();
	const [redirect, setRedirect] = useState<string>("/blog");


	useEffect(()=>{
		if(accessToken && refreshToken){
			router.push(window.location.pathname);
			router.refresh();
		}
	},[accessToken, refreshToken])

	async function handleLogout() {
		deleteCookie("accessToken");
		deleteCookie("refreshToken");
		setAccessToken("");
		setRefreshToken("");
		router.push("/blog");
		router.refresh();

	}

	async function getAccessToken(refreshToken:string) {
		const res= await getAccessTokenByRefreshToken(refreshToken);
		if(res.status === 201){
			const refreshAccessToken = res.data.data.accessToken;
			setAccessToken(refreshAccessToken);
			setCookie("accessToken",refreshAccessToken, {
				maxAge: 60 * 60
			});
		}else{
			deleteCookie("accessToken");
			deleteCookie("refreshToken");
			setAccessToken("");
			setRefreshToken("");
		}
	}

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		const accesstoken = getCookie("accessToken") ?? "";
		const refreshtoken = getCookie("refreshToken") ?? "";
		if(accesstoken){
			setAccessToken(accesstoken);
			setRefreshToken(refreshtoken);
		}else if(!accesstoken && refreshtoken){
			getAccessToken(refreshtoken);
		}

		if(searchParams){
			const searchAccessToken = searchParams.get('accessToken');
			const searchRefreshToken = searchParams.get('refreshToken');
			const expiresIn = parseInt(searchParams.get('expiresIn') ?? "60");
			if(searchAccessToken && searchRefreshToken){
				setCookie("accessToken",searchAccessToken, {
					maxAge: expiresIn * 60
				});
				setAccessToken(searchAccessToken);
				setCookie("refreshToken",searchRefreshToken, {
					maxAge: 10080 * 60
				});
				setRefreshToken(searchRefreshToken);
			}
		}

		const current = getCookie("currentPage") ?? "/blog"
		setRedirect(current);
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
							href="/contact"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Contact
						</Link>
						<Link
							href="https://www.chomanki.com"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
						>
							Portfolio
						</Link>
						{ !accessToken &&
							<Link
							href="/blog/login"
							className="duration-200 text-zinc-400 hover:text-zinc-100"
							>
								Login 
							</Link>
						}
						{	accessToken &&
							<Link
							onClick={handleLogout}
							href={redirect}
							className="duration-200 text-zinc-400 hover:text-zinc-100"
							>
								Logout
							</Link>
						}

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
