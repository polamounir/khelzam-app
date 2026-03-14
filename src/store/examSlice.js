// src/store/examSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchExamById as apiFetchExamById } from '../api/examApi';

export const fetchExamById = createAsyncThunk(
  'exam/fetchById',
  async (examId, { rejectWithValue }) => {
    try {
      const data = await apiFetchExamById(examId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  examData: null,
  answers: {},           // { [questionId]: string | string[] }
  status: 'idle',        // idle | loading | active | submitting | submitted | expired | error
  userName: '',
  deviceFingerprint: '',
  submittedAt: null,
  submissionResult: null, // { score, totalPossibleScore, percentage, submittedAt }
  loading: false,
  error: null,
};

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    startExam(state, action) {
      const { userName, deviceFingerprint } = action.payload;
      state.userName = userName;
      state.deviceFingerprint = deviceFingerprint;
      state.status = 'active';
    },
    setAnswer(state, action) {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    expireExam(state, action) {
      state.status = 'expired';
      state.submittedAt = new Date().toISOString();
      if (action.payload) {
        state.submissionResult = action.payload;
      }
    },
    submitExam(state, action) {
      state.status = 'submitted';
      state.submittedAt = new Date().toISOString();
      if (action.payload) {
        state.submissionResult = action.payload;
      }
    },
    setSubmitting(state) {
      state.status = 'submitting';
    },
    resetExam() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamById.fulfilled, (state, action) => {
        state.loading = false;
        state.examData = action.payload;
      })
      .addCase(fetchExamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  startExam,
  setAnswer,
  expireExam,
  submitExam,
  setSubmitting,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;
