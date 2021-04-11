import React from 'react';

export const Indicator = ({imgSrc, title, valueText}) => (
    <div style={{
        width: '14rem', height: '8rem', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#f1f1f1', overflow:'hidden', 
        border: '1px solid #bdbdbd', fontFamily: "'Courier New', monospace"
                    
    }}>
        <img src={imgSrc} width={'25%'} style={{padding: '.5rem'}} />
        <div style={{
            width: '75%', height: '100%', display: 'flex', 
            direction: 'column', justifyContent: 'center', 
            alignItems: 'center', flexDirection: 'column',
        }}>
            <span style={{fontSize: '1.5em', fontWeight: 'lighter'}}>{title}</span>
            <span style={{fontSize: '2em', fontWeight: 700}}>{valueText}</span>
        </div>
    </div>
);