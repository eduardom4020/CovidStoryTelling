import React from 'react';

export const StorySlide = ({active, ...props}) => {
    return (
        <div {...props}>{active ? 'Ativo!' : ''}</div>
    );
}