import React, { useRef, useEffect, useState } from 'react';

export const StoryScrollableContainer = ({children}) => {
    const [ currentSlideIndex, setSlideIndex ] = useState(1);
    const containerRef = useRef();
    
    const handleScroll = () => {
        if(containerRef.current) {
            const childrenDOM = [...containerRef.current.children];
            const childrenTop = childrenDOM.map(c => c.getBoundingClientRect().y);
            const slideNumber = childrenTop.length - childrenTop.reverse().findIndex(y => y <= 0);
            setSlideIndex(slideNumber);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])
    
    const Children = !children.length ? [children] : children;

    return (
        <div ref={containerRef}>
            {Children.map((child, index) => (
                React.cloneElement(child, { ...child.props, active: currentSlideIndex === index + 1 })
            ))}
        </div>
    );
}