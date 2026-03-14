// src/api/examApi.js
import axiosInstance from './axiosInstance';

/**
 * Fetch exam data by ID from the backend.
 * End-point: GET /api/exams/:examId
 */
export async function fetchExamById(examId) {
  try {
    const response = await axiosInstance.get(`/exams/${examId}`);
    return response.data;
  } catch (err) {
    console.error(`[API] fetchExamById failed for ${examId}:`, err);
    throw err;
  }
}

/**
 * Submit exam answers + integrity payload to the backend.
 * End-point: POST /api/exams/:examId/submit
 */
export async function submitExamAnswers(examId, payload) {
  try {
    const response = await axiosInstance.post(`/exams/${examId}/submit`, payload);
    return response.data;
  } catch (err) {
    console.error(`[API] submitExamAnswers failed for ${examId}:`, err);
    throw err;
  }
}
