// src/store/integritySlice.js
import { createSlice } from '@reduxjs/toolkit';

const EVENT_TYPES = {
  TAB_EXIT: 'tab_exit',
  TAB_RETURN: 'tab_return',
  WINDOW_BLUR: 'window_blur',
  WINDOW_FOCUS: 'window_focus',
};

const initialState = {
  tabExitCount: 0,
  tabReturnCount: 0,
  windowBlurCount: 0,
  windowFocusCount: 0,
  events: [], // [{ id, type, timestamp }]
};

const integritySlice = createSlice({
  name: 'integrity',
  initialState,
  reducers: {
    recordExit(state, action) {
      const { type } = action.payload; // 'tab_exit' | 'window_blur'
      state.events.push({
        id: state.events.length + 1,
        type,
        timestamp: new Date().toISOString(),
      });
      if (type === EVENT_TYPES.TAB_EXIT) state.tabExitCount += 1;
      if (type === EVENT_TYPES.WINDOW_BLUR) state.windowBlurCount += 1;
    },
    recordReturn(state, action) {
      const { type } = action.payload; // 'tab_return' | 'window_focus'
      state.events.push({
        id: state.events.length + 1,
        type,
        timestamp: new Date().toISOString(),
      });
      if (type === EVENT_TYPES.TAB_RETURN) state.tabReturnCount += 1;
      if (type === EVENT_TYPES.WINDOW_FOCUS) state.windowFocusCount += 1;
    },
    resetIntegrity() {
      return initialState;
    },
  },
});

export const EVENT_LABELS = {
  tab_exit: '🚨 Tab Left',
  tab_return: '✅ Tab Returned',
  window_blur: '⚠️ Window Blurred',
  window_focus: '✅ Window Focused',
};

export const { recordExit, recordReturn, resetIntegrity } = integritySlice.actions;
export default integritySlice.reducer;
