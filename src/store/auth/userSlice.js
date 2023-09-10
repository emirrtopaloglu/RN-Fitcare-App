import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  uid: null,
  data: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.uid = action.payload;
    },
    userData: (state, action) => {
      state.data = action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const {getUser, userData, logout} = userSlice.actions;

export default userSlice.reducer;
