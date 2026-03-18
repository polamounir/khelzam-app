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
      // Pass the whole data object if it exists (for specific error handling) or the message
      return rejectWithValue(err.data || { message: err.message });
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
  flaggedQuestions: [], // Array of question IDs
  reviewMode: false,
  submissionId: null,    // ID of existing submission if already submitted
  alreadySubmittedData: null, // Full data from "already submitted" response
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
        state.submissionResult = action.payload.result || action.payload;
        state.submissionId = action.payload.submissionId || state.submissionId;
        state.alreadySubmittedData = action.payload; // Store full response for reference
      }
    },
    submitExam(state, action) {
      state.status = 'submitted';
      state.submittedAt = new Date().toISOString();
      if (action.payload) {
        state.submissionResult = action.payload.result || action.payload;
        state.submissionId = action.payload.submissionId || state.submissionId;
        state.alreadySubmittedData = action.payload; // Store full response for reference
      }
    },
    setSubmitting(state) {
      state.status = 'submitting';
    },
    toggleFlag(state, action) {
      const questionId = action.payload;
      if (state.flaggedQuestions.includes(questionId)) {
        state.flaggedQuestions = state.flaggedQuestions.filter(id => id !== questionId);
      } else {
        state.flaggedQuestions.push(questionId);
      }
    },
    setReviewMode(state, action) {
      state.reviewMode = action.payload;
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
        const payload = action.payload;
        
        // Handle "Already Submitted" case
        if (payload?.message === "You have already submitted this exam." && payload.data) {
          state.status = 'submitted';
          state.examData = {
            _id: payload.data.examId,
            title: payload.data.examTitle,
            description: payload.data.examDescription,
            image: payload.data.examImage,
            startDate: payload.data.examStartDate,
            endDate: payload.data.examEndDate,
          };
          state.submissionId = payload.data.submissionId;
          state.alreadySubmittedData = payload.data;
          state.error = null;
        } else {
          state.error = typeof payload === 'string' ? payload : payload?.message || 'Failed to fetch exam';
        }
      });
  },
});

export const {
  startExam,
  setAnswer,
  expireExam,
  submitExam,
  setSubmitting,
  toggleFlag,
  setReviewMode,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;
