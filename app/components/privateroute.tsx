import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

type Props = {
	req: string;
};
export const PrivateRoute: React.FC<Props> = ({ req }) => {
    const router = useRouter();
    useEffect(() => {
      router.push('/login');
    }, [router]);
    return <></>;
}
