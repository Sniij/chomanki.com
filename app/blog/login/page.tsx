import React  from "react";
import Link from "next/link";
import Navigation from "@/app/components/nav";
import { Card } from "@/app/components/card";
import {cookies} from 'next/headers';

export default function Login() {



    return (


        <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black">
        <Navigation />
            <div className="h-screen flex w-9/12 items-center justify-center">

            <div className="max-w-screen-sm w-full flex flex-col gap-y-2 rounded-lg p-4 bg-base-200">
                <h2 className="text-2xl font-bold mb-4">Login with Google</h2>
                    <Card>
                            <Link
                                href={"http://localhost:8080/auth/login"}
                                className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 md:p-16"
                            >
                                    <div className="flex justify-center text-gray-300 hover:text-blue-500 duration-150">
                                        Login with Google
                                    </div>
                            </Link>
                    </Card>
            </div>
            </div>
        </div>
  );

}
