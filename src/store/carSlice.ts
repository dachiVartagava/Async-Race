import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

export interface Car {
  id: number;
  name: string;
  color: string;
}

interface CarState {
  cars: Car[];
  currentPage: number;
  totalCount: number;
  selectedCar: Car | null;
  animations: { [key: number]: { position: number; duration: number } };
  raceResults: { id: number; name: string; time: number }[];
  isRacing: boolean;
  // Persistent state for inputs to survive page switches
  createNameInput: string;
  createColorInput: string;
  updateNameInput: string;
  updateColorInput: string;
}

const initialState: CarState = {
  cars: [],
  currentPage: 1,
  totalCount: 0,
  selectedCar: null,
  animations: {},
  raceResults: [],
  isRacing: false,
  createNameInput: '',
  createColorInput: '#ffffff',
  updateNameInput: '',
  updateColorInput: '#ffffff',
};

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCarsData: (state, action: PayloadAction<{ cars: Car[]; totalCount: number }>) => {
      state.cars = action.payload.cars;
      state.totalCount = action.payload.totalCount;
    },
    nextPage: (state) => {
      if (state.currentPage < Math.ceil(state.totalCount / 7)) state.currentPage += 1;
    },
    prevPage: (state) => {
      if (state.currentPage > 1) state.currentPage -= 1;
    },
    selectCar: (state, action: PayloadAction<Car>) => {
      state.selectedCar = action.payload;
      state.updateNameInput = action.payload.name;
      state.updateColorInput = action.payload.color;
    },
    updateCarAnimation: (state, action: PayloadAction<{ id: number; animation: { position: number; duration: number } }>) => {
      state.animations[action.payload.id] = action.payload.animation;
    },
    addRaceResult: (state, action: PayloadAction<{ id: number; name: string; time: number }>) => {
      // Prevent duplicate entries for the same car
      if (!state.raceResults.some(r => r.id === action.payload.id)) {
        state.raceResults.push(action.payload);
      }
    },
    clearRaceResults: (state) => {
      state.raceResults = [];
      state.animations = {};
    },
    setIsRacing: (state, action: PayloadAction<boolean>) => {
      state.isRacing = action.payload;
    },
    // Input state handlers
    setCreateName: (state, action: PayloadAction<string>) => { state.createNameInput = action.payload; },
    setCreateColor: (state, action: PayloadAction<string>) => { state.createColorInput = action.payload; },
    setUpdateName: (state, action: PayloadAction<string>) => { state.updateNameInput = action.payload; },
    setUpdateColor: (state, action: PayloadAction<string>) => { state.updateColorInput = action.payload; },
  },
});

export const {
  setCarsData, nextPage, prevPage, selectCar,
  updateCarAnimation, addRaceResult, clearRaceResults,
  setIsRacing, setCreateName, setCreateColor, setUpdateName, setUpdateColor
} = carSlice.actions;

export default carSlice.reducer;