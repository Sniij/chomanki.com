"use client";
import { ArrowLeft, Eye, Github } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams,useRouter } from 'next/navigation'
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import Logout from "@/app/components/logout"
import { getAccessTokenByRefreshToken } from '@/service/blogservice'

type Props = {
	blog: {
		url?: string;
		title: string;
		description: string;
		repository?: string;
	};

	views: number;
};
export const Header: React.FC<Props> = ({ blog, views }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);
	const [accessToken, setAccessToken] = useState<string>("");
	const [refreshToken, setRefreshToken] = useState<string>("");
	const router = useRouter();
	const [redirect, setRedirect] = useState<string>("/blog");
	const searchParams = useSearchParams();

	const links: { label: string; href: string }[] = [];
	if (blog.repository) {
		links.push({
			label: "GitHub",
			href: `https://github.com/${blog.repository}`,
		});
	}
	if (blog.url) {
		links.push({
			label: "Website",
			href: blog.url,
		});
	}


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
		const current = getCookie("currentPage") ?? "/blog";
		router.push(current);
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
			alert("로그인 정보가 만료되었습니다. 로그인 페이지로 넘어갑니다.");
			router.push("/blog/login");
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

		<header
			ref={ref}
			className="bg-bg-ex bg-cover relative isolate overflow-hidden"
		>      
			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur-sm lg:backdrop-blur-sm duration-200 border-b lg:bg-transparent ${
					isIntersecting
						? "bg-zinc-900/0 border-transparent"
						: "bg-white/10  border-zinc-200 lg:border-transparent"
				}`}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						<span
							title="View counter for this page"
							className={`duration-200 hover:font-medium flex items-center gap-1 ${
								isIntersecting
									? " text-zinc-400 hover:text-zinc-100"
									: "text-zinc-600 hover:text-blue-500"
							} `}
						>
							<Eye className="w-5 h-5" />{" "}
							{Intl.NumberFormat("en-US", { notation: "compact" }).format(
								views,
							)}
						</span>
						<Link target="_blank" href="https://github.com/Sniij">
							<Github
								className={`w-6 h-6 duration-200 hover:font-medium ${
									isIntersecting
										? " text-zinc-400 hover:text-zinc-100"
										: "text-zinc-600 hover:text-blue-500"
								} `}
							/>
						</Link>
						{ !accessToken &&
							<Link
							href="/blog/login"
							className={`duration-200 hover:font-medium ${
								isIntersecting
									? " text-zinc-400 hover:text-zinc-100"
									: "text-zinc-600 hover:text-blue-500"
							} `}
							>
								Login 
							</Link>
						}
						{	accessToken &&
							<a
							onClick={handleLogout}
							href={redirect}
							className={`duration-200 hover:font-medium ${
								isIntersecting
									? " text-zinc-400 hover:text-zinc-100"
									: "text-zinc-600 hover:text-blue-500"
							} `}
							>
								Logout
							</a>
						}
					</div>

					<Link
						href="/blog"
						className={`duration-200 hover:font-medium ${
							isIntersecting
								? " text-zinc-400 hover:text-zinc-100"
								: "text-zinc-600 hover:text-blue-500"
						} `}
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>

				</div>
			</div>
			<div className="bg-black opacity-70 ">
			<div className="container mx-auto relative isolate overflow-hidden  py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h1 className="text-4xl font-bold font-GSans tracking-tight text-white sm:text-5xl font-display">
							{blog.title}
						</h1>
						<p className="mt-6 font-bold font-GSans text-lg leading-8 text-zinc-300">
							{blog.description}
						</p>
					</div>

					<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
						<div className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
							{links.map((link) => (
								<Link target="_blank" key={link.label} href={link.href}>
									{link.label} <span aria-hidden="true">&rarr;</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>		</div>
		</header>

	);
};
