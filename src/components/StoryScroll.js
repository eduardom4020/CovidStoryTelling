import React, { useState, useEffect } from 'react'

const handleScroll = e => {
    console.log(`${window.scrollY * 100 / window.innerHeight}%`);
}

export const StoryScroll = () => {

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);
    
    return <></>;
}