import {configureStore} from '@reduxjs/toolkit';
import userReducer from './auth/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
