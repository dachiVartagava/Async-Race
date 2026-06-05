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

  // Trigger the race for all cars on the current page
  async function startrace() {
    if (cars.length === 0) return;
    dispatch(clearRaceResults());
    dispatch(setIsRacing(true)); // Lock UI

    const promises = cars.map(async (car) => {
      const engineData = await startEngineApi(car.id);
      
      if (engineData.velocity > 0) {
        const timeInSeconds = engineData.distance / engineData.velocity / 1000;
        
        // Start CSS animation
        dispatch(updateCarAnimation({ id: car.id, animation: { position: 950, duration: timeInSeconds } }));

        const drivePromise = driveEngineApi(car.id);
        
        return new Promise<void>(async (resolve) => {
          // Timer to register finish time
          const timeoutId = setTimeout(() => {
            dispatch(addRaceResult({ id: car.id, name: car.name, time: Number(timeInSeconds.toFixed(2)) }));
            resolve();
          }, timeInSeconds * 1000);

          // Handle 500 error if engine breaks during the race
          const driveResult = await drivePromise;
          if (!driveResult.success) {
            clearTimeout(timeoutId);
            dispatch(updateCarAnimation({ id: car.id, animation: { position: 450, duration: 0 } })); // Stop mid-track
            resolve();
          }
        });
      }
    });

    await Promise.all(promises);
    
    // Save the first place winner to the database
    if (raceResults.length > 0) {
      const winner = raceResults[0];
      await saveWinnerApi(winner.id, 1, winner.time);
    }
    
    dispatch(setIsRacing(false)); // Unlock UI
  }

  // Reset cars to starting positions
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
    
    // Refresh list without reloading the page
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
    <header className="main-header" style={{ opacity: isRacing ? 0.9 : 1 }}>
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
        <button 
          disabled={isRacing} 
          className={`nav-btn ${currentView === 'winners' ? 'active' : ''}`} 
          onClick={() => dispatch(setView('winners'))}
        >
          To Winners
        </button>
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

      {/* Real-time race winner banner */}
      {raceResults.length > 0 && (
        <div style={{ position: 'fixed', top: '160px', right: '20px', background: 'rgba(0,0,0,0.9)', padding: '15px', borderRadius: '8px', border: '2px solid #ffcc00', zIndex: 1000, color: '#fff' }}>
          <h3 style={{ color: '#ffcc00', marginTop: 0, marginBottom: 0 }}>🏆 Winner: {raceResults[0].name} ({raceResults[0].time}s)</h3>
        </div>
      )}
    </header>
  );
};