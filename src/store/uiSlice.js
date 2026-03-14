// src/store/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [], // { id, message, type: 'success' | 'error' | 'info', duration }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast(state, action) {
      const { message, type = 'info', duration = 4000 } = action.payload;
      state.toasts.push({
        id: Date.now() + Math.random(),
        message,
        type,
        duration,
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
