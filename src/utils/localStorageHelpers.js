// src/utils/localStorageHelpers.js

const STORAGE_KEY = 'khelzam_exam_state';

/**
 * Save exam + integrity state to localStorage
 */
export function saveExamState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('[LocalStorage] Failed to save state:', err);
  }
}

/**
 * Load persisted state from localStorage
 * Returns null if nothing is saved
 */
export function loadExamState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (err) {
    console.warn('[LocalStorage] Failed to load state:', err);
    return null;
  }
}

/**
 * Clear all persisted exam state
 */
export function clearExamState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[LocalStorage] Failed to clear state:', err);
  }
}

/**
 * Save a specific key to localStorage (for simple values)
 */
export function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[LocalStorage] Failed to set ${key}:`, err);
  }
}

/**
 * Get a specific key from localStorage
 */
export function getLocalItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}
