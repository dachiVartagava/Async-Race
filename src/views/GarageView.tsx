import React, { useState, useEffect } from 'react';
import { CarIcon } from '../components/CarIcon';
import { useDispatch, useSelector } from 'react-redux';
import { startEngineApi, getCars, deleteCarApi } from '../api/carApi';
import { setCarsData, nextPage, prevPage, selectCar, updateCarAnimation } from '../store/carSlice';
import { type RootState } from '../store';

export const GarageView: React.FC = () => {
  const dispatch = useDispatch();
  
  const { cars, currentPage, totalCount, animations, isRacing } = useSelector((state: RootState) => state.cars);
  const totalPages = Math.ceil(totalCount / 7);

  const [carPositions, setCarPositions] = useState<{ [key: number]: number }>({});
  const [carDurations, setCarDurations] = useState<{ [key: number]: number }>({});
 
  // Sync local animations with Redux state
  useEffect(() => {
    if (animations && Object.keys(animations).length > 0) {
      const newPositions: { [key: number]: number } = {};
      const newDurations: { [key: number]: number } = {};

      Object.keys(animations).forEach((idStr) => {
        const id = Number(idStr);
        if (animations[id]) {
          newPositions[id] = animations[id].position;
          newDurations[id] = animations[id].duration;
        }
      });

      setCarPositions(prev => ({ ...prev, ...newPositions }));
      setCarDurations(prev => ({ ...prev, ...newDurations }));
    } else {
      setCarPositions({});
      setCarDurations({});
    }
  }, [animations]);

  // Fetch cars when page changes
  useEffect(() => {
    const fetchGarageCars = async () => {
      const data = await getCars(currentPage); 
      dispatch(setCarsData(data));
    };
    fetchGarageCars();
  }, [currentPage, dispatch]);

  const startgame = async (id: number) => {
    const engineData = await startEngineApi(id);
    if (engineData.velocity > 0) {
      const timeInSeconds = engineData.distance / engineData.velocity / 1000;
      setCarDurations(prev => ({ ...prev, [id]: timeInSeconds }));
      setCarPositions(prev => ({ ...prev, [id]: 950 })); 
    }
  };

  const stopRace = (id: number) => {
    setCarDurations(prev => ({ ...prev, [id]: 0 }));
    setCarPositions(prev => ({ ...prev, [id]: 0 }));
    dispatch(updateCarAnimation({ id, animation: { position: 0, duration: 0 } }));
  };

  async function removefunc(id: number) {
    await deleteCarApi(id);
    const data = await getCars(currentPage); 
    dispatch(setCarsData(data));
  }

  return (
    <div className="view-container">
      <h2 style={{ color: '#ffffff', paddingLeft: '20px' }}>
        Garage Page #{currentPage} of {totalPages} (Total: {totalCount} cars)
      </h2>
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {cars.map((car) => {
          const currentPos = carPositions[car.id] || 0;
          const currentDur = carDurations[car.id] || 0;

          return (
            <li 
              key={car.id}
              style={{
                marginBottom: '20px',
                padding: '0.25rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <div className='abbtn'>
                <button disabled={isRacing} onClick={() => dispatch(selectCar(car))}>SELECT</button>
                <button disabled={isRacing} onClick={() => removefunc(car.id)}>REMOVE</button>
              </div>
              
              <div className="abbtn">
                <button disabled={isRacing} onClick={() => startgame(car.id)}>A</button>
                <button disabled={isRacing} onClick={() => stopRace(car.id)}>b</button>
              </div>
              
              <div 
                className="car-icon-wrapper"
                style={{
                  transform: `translateX(${currentPos}px)`,
                  transition: `transform ${currentDur}s linear`,
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
              
              <div className="dashroad">
                <p>Start</p>
                <p>Finish</p>
              </div>
            </li>
          );
        })}
      </ul>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center' }}>
        <button 
          disabled={currentPage === 1 || isRacing}
          onClick={() => dispatch(prevPage())}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          ◀ PREV
        </button>
        
        <button 
          disabled={currentPage === totalPages || totalPages === 0 || isRacing}
          onClick={() => dispatch(nextPage())}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          NEXT ▶
        </button>
      </div>
    </div>
  );
};