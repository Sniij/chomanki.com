"use client";

import { useEffect } from 'react';

export const ReportView: React.FC<{ slug: string }> = ({ slug }) => {
    
    useEffect(() => {

    const visitedPages: { [key: string]: boolean } = JSON.parse(localStorage.getItem('visitedPages') || '{}');

        if (!visitedPages[slug]) {
            fetch('/api/incr', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ slug: slug })
            });
            visitedPages[slug] = true;
            localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
        }
    }, [slug]);

    return null;
};