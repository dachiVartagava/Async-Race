import React,{useState} from 'react';
import {CarIcon} from './CarIcon';
import { startEngineApi } from '../api/carApi';
import { type Car } from '../api/carApi';
interface CarTrackProps{
    car:Car;
    onSelect: () => void;
    onRemove: () => void;
}
export const CarTrack: React.FC<CarTrackProps> = ({car,onSelect,onRemove}) =>{
    const [position,setPosition] = useState<number>(0);
    const [duration,setDuration] = useState<number>(0);
    const startRace = async () =>{
        const engineData = await startEngineApi(car.id);
        if(engineData.velocity > 0){
            const timeInSeconds = engineData.distance /engineData.velocity/1000;
            setDuration(timeInSeconds);
            setPosition(800);
        }
    };
    const stopRace = () =>{
        setDuration(0);
        setPosition(0);
    };
    return (
    <li style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
    
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className='abbtn'>
          <button onClick={onSelect}>SELECT</button>
          <button onClick={onRemove}>REMOVE</button>
        </div>
        
        <div className="abbtn">
          <button onClick={startRace} style={{ background: 'green', color: 'white' }}>A</button>
          <button onClick={stopRace} style={{ background: 'red', color: 'white' }}>B</button>
        </div>
        
        
        <div 
          style={{ 
            transform: `translateX(${position}px)`, 
            transition: `transform ${duration}s linear`, 
            display: 'inline-block'
          }}
        >
          <CarIcon color={car.color}/>
        </div>
        
        <div className="car-info">
          <strong style={{ fontSize: '0.89rem', color: '#fff', fontWeight: 'normal' }}>
            {car.name}
          </strong>
        </div>
      </div>
      
   
      <div className="dashroad">
        <p>Start</p>
        <p>Finish</p>
      </div>
      
    </li>
  );
}