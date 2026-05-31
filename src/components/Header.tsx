import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store'; 
import { setView } from '../store/viewSlice';
import { generateRandomCars } from '../utils/carGenerator';
import { generateCarsApi } from '../api/carApi';
export interface Car{
    id:number,
    name:string,
    color:string;
}

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const currentView = useSelector((state: RootState) => state.view.currentView);
  function startrace(){

  }
  function resetgame(){

  }
  function createcars(){

  }
  function  updatecars(){

  }
  async function handleGenerateCars(){
    const randomCars = generateRandomCars();
    await generateCarsApi(randomCars);
  }

  return (
    <header className="main-header">
      <div className="logo">Async Race</div>
      <nav className="nav-buttons">
        <button 
          className={`nav-btn ${currentView === 'garage' ? 'active' : ''}`}
          onClick={() => dispatch(setView('garage'))}
        >
          To Garage
        </button>
        <button 
          className={`nav-btn ${currentView === 'winners' ? 'active' : ''}`}
          onClick={() => dispatch(setView('winners'))}
        >
          To Winners
        </button>
      </nav>
      <div className="gamebtn">
        <div className="racers">
        <button onClick={startrace}>RACE</button>
        <button onClick={resetgame}>RESET</button>
        </div>
        <div className="inputelement">
        <input type="text" placeholder="TYPE CAR BRAND"/>
        <input type="color" value="#fffff" className="palitra"/>
        <button onClick={createcars}>CREATE</button></div>
        <div className="inputelement">
        <input type="text" placeholder="TYPE CAR BRAND"/>
        <input type="color" value="#fffff" className="palitra"/>
        <button onClick={updatecars}>UPDATE</button></div>
        <button onClick={handleGenerateCars}>GENERATE CARS</button>
      </div>
    </header>
  );
};