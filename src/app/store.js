// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import examReducer from '../store/examSlice';
import integrityReducer from '../store/integritySlice';
import uiReducer from '../store/uiSlice';
import { loadExamState, saveExamState, clearExamState } from '../utils/localStorageHelpers';

// Rehydrate persisted state on startup
const persisted = loadExamState();

export const store = configureStore({
  reducer: {
    exam: examReducer,
    integrity: integrityReducer,
    ui: uiReducer,
  },
  preloadedState: persisted
    ? { exam: persisted.exam, integrity: persisted.integrity }
    : undefined,
});

// Persist exam + integrity state to localStorage on every change
store.subscribe(() => {
  const state = store.getState();
  
  // If exam is submitted or expired, we should not persist the state anymore
  if (state.exam.status === 'submitted' || state.exam.status === 'expired') {
    clearExamState();
    return;
  }

  saveExamState({
    exam: state.exam,
    integrity: state.integrity,
  });
});

export default store;
