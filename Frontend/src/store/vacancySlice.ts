import { createSlice } from '@reduxjs/toolkit';

const vacancySlice = createSlice({
    name: 'vacancy',
    initialState: { currentVacancy: null },
    reducers: {
        setVacancy: (state, action) => {
            state.currentVacancy = action.payload;
        },
        clearVacancy: (state) => {
            state.currentVacancy = null;
        },
    },
});

export const { setVacancy, clearVacancy } = vacancySlice.actions;
export default vacancySlice.reducer;
