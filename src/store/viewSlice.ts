import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface ViewState{
    currentView: 'garage' | 'winners';
}
const initialState: ViewState={
    currentView: 'garage',
};
const viewSlice = createSlice({
    name: 'view',
    initialState,
    reducers:{
        setView:(state,action:PayloadAction<'garage' | 'winners'>) =>{
            state.currentView=action.payload
        },
    },
});
export const {setView} = viewSlice.actions;
export default viewSlice.reducer;