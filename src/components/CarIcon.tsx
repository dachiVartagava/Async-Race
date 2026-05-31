import React from 'react';
interface CarIconProps{
    color:string;
}
export const CarIcon: React.FC<CarIconProps> = ({color})=>{
    return (
        <svg  width="80px" height="35px" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
        <path
        d="M15 35 L15 25 Q15 20 25 20 L40 20 Q45 10 60 10 L80 15 Q90 15 90 25 L90 35 Q90 40 85 40 L75 40 Q70 30 60 30 Q50 30 45 40 L35 40 Q30 30 20 30 Q10 30 5 40 Z "
        fill={color || '#ffffff'}/>
        <circle cx="25" cy="40" r="8" fill="#000"/> {/* back circle*/}
        <circle cx="25" cy="40" r="4" fill="#ccc"/>
        <circle cx="70" cy="40" r="8" fill="#000"/> {/* back circle*/}
        <circle cx="70" cy="40" r="4" fill="#ccc"/>
        </svg>
    );
};