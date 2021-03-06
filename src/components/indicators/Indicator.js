import React from 'react';

export const Indicator = ({imgSrc, title, valueText, style}) => (
    <div style={{
        width: '12rem', backgroundColor: '#f1f1f1', border: '1px solid #bdbdbd',
        ...style,
        height: '4rem', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', overflow:'hidden', fontFamily: "'Courier New', monospace"            
    }}>
        <img src={imgSrc} width={'25%'} style={{padding: '.5rem'}} />
        <div style={{
            width: '75%', height: '100%', display: 'flex', 
            direction: 'column', justifyContent: 'center', 
            alignItems: 'center', flexDirection: 'column',
        }}>
            <span style={{fontSize: '.75em', fontWeight: 'lighter'}}>{title}</span>
            <span style={{fontSize: '1em', fontWeight: 700}}>{valueText}</span>
        </div>
    </div>
);