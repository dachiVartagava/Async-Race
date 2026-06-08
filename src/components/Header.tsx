import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store'; 
import { setView } from '../store/viewSlice';
import { generateRandomCars } from '../utils/carGenerator';
import { carTypelabel } from '../utils/carCreater';
import { generateCarsApi, updateCarApi, startEngineApi, driveEngineApi, getCars, saveWinnerApi } from '../api/carApi';
import { 
  updateCarAnimation, addRaceResult, clearRaceResults, setIsRacing,
  setCreateName, setCreateColor, setUpdateName, setUpdateColor, setCarsData 
} from '../store/carSlice';

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  
  const currentView = useSelector((state: RootState) => state.view.currentView);
  const selectedCar = useSelector((state: RootState) => state.cars.selectedCar);
  const { cars, raceResults, isRacing, currentPage, createNameInput, createColorInput, updateNameInput, updateColorInput } = useSelector((state: RootState) => state.cars);

  async function startrace() {
    if (cars.length === 0) return;
    dispatch(clearRaceResults());
    dispatch(setIsRacing(true));

    let localWinnerDeclared = false; // Tracks if a winner has already been saved for this race

    const promises = cars.map(async (car) => {
      const engineData = await startEngineApi(car.id);
      
      if (engineData.velocity > 0) {
        const timeInSeconds = engineData.distance / engineData.velocity / 1000;
        
        dispatch(updateCarAnimation({ id: car.id, animation: { position: 950, duration: timeInSeconds } }));

        const drivePromise = driveEngineApi(car.id);
        
        return new Promise<void>(async (resolve) => {
          const timeoutId = setTimeout(async () => {
            const currentFinishedTime = Number(timeInSeconds.toFixed(2));
            dispatch(addRaceResult({ id: car.id, name: car.name, time: currentFinishedTime }));
            
            if (!localWinnerDeclared) {
              localWinnerDeclared = true;
              await saveWinnerApi(car.id, 1, currentFinishedTime);
            }
            
            resolve();
          }, timeInSeconds * 1000);

          const driveResult = await drivePromise;
          if (!driveResult.success) {
            clearTimeout(timeoutId);
            dispatch(updateCarAnimation({ id: car.id, animation: { position: 450, duration: 0 } }));
            resolve();
          }
        });
      }
    });

    await Promise.all(promises);
    dispatch(setIsRacing(false));
  }

  async function resetgame() {
    dispatch(clearRaceResults());
    dispatch(setIsRacing(false));
    const refreshedData = await getCars(currentPage);
    dispatch(setCarsData(refreshedData));
  }

  async function createcars() {
    if (!createNameInput.trim()) return alert("Please type a car brand");
    const createcar = carTypelabel(createNameInput, createColorInput);
    await generateCarsApi(createcar);
    dispatch(setCreateName(''));
    const refreshedData = await getCars(currentPage);
    dispatch(setCarsData(refreshedData));
  }

  async function updatecars() {
    if (!selectedCar) return alert("Please select a car first!");
    await updateCarApi(selectedCar.id, { name: updateNameInput, color: updateColorInput });
    const refreshedData = await getCars(currentPage);
    dispatch(setCarsData(refreshedData));
  }

  async function handleGenerateCars() {
    dispatch(setIsRacing(true));
    const randomCars = generateRandomCars();
    await generateCarsApi(randomCars);
    const refreshedData = await getCars(currentPage);
    dispatch(setCarsData(refreshedData));
    dispatch(setIsRacing(false));
  }

  return (
    <header className="main-header">
      <div className="logo">Async Race</div>
      <nav className="nav-buttons">
        <button 
          disabled={isRacing} 
          className={`nav-btn ${currentView === 'garage' ? 'active' : ''}`} 
          onClick={() => {
            dispatch(setView('garage'));
            dispatch(clearRaceResults());
          }}
        >
          To Garage
        </button>
        <button disabled={isRacing} className={`nav-btn ${currentView === 'winners' ? 'active' : ''}`} onClick={() => dispatch(setView('winners'))}>To Winners</button>
      </nav>
      <div className="gamebtn">
        <div className="racers">
          <button disabled={isRacing} onClick={startrace}>RACE</button>
          <button onClick={resetgame}>RESET</button>
        </div>
        <div className="inputelement">
          <input disabled={isRacing} type="text" placeholder="TYPE CAR BRAND" value={createNameInput} onChange={(e) => dispatch(setCreateName(e.target.value))}/>
          <input disabled={isRacing} type="color" value={createColorInput} className="palitra" onChange={(e) => dispatch(setCreateColor(e.target.value))}/>
          <button disabled={isRacing} onClick={createcars}>CREATE</button>
        </div>
        <div className="inputelement">
          <input disabled={isRacing} type="text" placeholder="TYPE CAR BRAND" value={updateNameInput} onChange={(e) => dispatch(setUpdateName(e.target.value))}/>
          <input disabled={isRacing} type="color" value={updateColorInput} className="palitra" onChange={(e) => dispatch(setUpdateColor(e.target.value))} />
          <button disabled={isRacing} onClick={updatecars}>UPDATE</button>
        </div>
        <button disabled={isRacing} onClick={handleGenerateCars}>GENERATE CARS</button>
      </div>

      {raceResults.length > 0 && (
        <div style={{ position: 'fixed', top: '160px', right: '20px', background: 'rgba(0,0,0,0.9)', padding: '15px', borderRadius: '8px', border: '2px solid #ffcc00', zIndex: 1000, color: '#fff' }}>
          <h3 style={{ color: '#ffcc00', marginTop: 0, marginBottom: 0 }}>🏆 Winner: {raceResults[0].name} ({raceResults[0].time}s)</h3>
        </div>
      )}
    </header>
  );
};