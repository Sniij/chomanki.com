"use client";
import React  from "react";

import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';


 const Logout = () => {

    const prev = getCookie('prevPage') ?? "/blog";
    const router = useRouter();
    useEffect(() => {

        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("JSESSIONID");
        router.push(prev);

      }, []);

    


    return (
        <></>
  );

};


export default Logout;