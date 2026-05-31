import { createSlice, type  PayloadAction } from '@reduxjs/toolkit';
import { type Car } from '../api/carApi';

interface CarState {
  cars: Car[];
  currentPage: number;
  totalCount:number;
}

const initialState: CarState = {
  cars: [],
  currentPage: 1,
  totalCount:0,
};

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    setCarsData: (state, action: PayloadAction<{cars: Car[];totalCount:number}>) => {
      state.cars = action.payload.cars;
      state.totalCount = action.payload.totalCount;
    },
    nextPage: (state) => {
        if(state.currentPage < Math.ceil(state.totalCount /7)){
            state.currentPage +=1;
        }
    },
    prevPage:(state) =>{
        if(state.currentPage > 1){
            state.currentPage -=1;
        }
    },
  },
});

export const { setCarsData,nextPage,prevPage} = carSlice.actions;
export default carSlice.reducer;