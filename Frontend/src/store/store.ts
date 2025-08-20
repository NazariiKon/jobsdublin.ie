import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/store/userSlice';
import vacancyReducer from '@/store/vacancySlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    vacancy: vacancyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;