// src/data/exams.js

export const EXAMS_DB = {
  exam_101: {
    examId: 'exam_101',
    title: 'React Performance & Integrity Test',
    description: 'Please complete all questions honestly. Do not leave the tab during the exam — all activity is monitored.',
    image: null,
    startDate: '2026-03-10T10:00:00Z',
    endDate: '2026-03-14T10:00:00Z',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        text: 'Which React hook is used for managing side effects in a functional component?',
        image: null,
        options: ['useState', 'useEffect', 'useMemo', 'useCallback'],
        correctAnswer: 'useEffect',
        score: 2,
      },
      {
        id: 'q2',
        type: 'trueFalse',
        text: 'React re-renders a component every time its state or props change.',
        image: null,
        options: ['True', 'False'],
        correctAnswer: 'True',
        score: 1,
      },
      {
        id: 'q3',
        type: 'mcq',
        text: 'Which of the following is used to prevent unnecessary re-renders by memoizing a component?',
        image: null,
        options: ['React.lazy', 'React.memo', 'useReducer', 'useRef'],
        correctAnswer: 'React.memo',
        score: 2,
      },
      {
        id: 'q4',
        type: 'multiSelect',
        text: 'Which of the following are valid React performance optimization techniques? (Select all that apply)',
        image: null,
        options: ['useMemo', 'useCallback', 'React.memo', 'useState', 'Code Splitting'],
        correctAnswer: ['useMemo', 'useCallback', 'React.memo', 'Code Splitting'],
        score: 3,
      },
      {
        id: 'q5',
        type: 'trueFalse',
        text: 'The useCallback hook returns a memoized version of the callback function that only changes if one of the dependencies has changed.',
        image: null,
        options: ['True', 'False'],
        correctAnswer: 'True',
        score: 1,
      },
      {
        id: 'q6',
        type: 'mcq',
        text: 'What does the Redux Toolkit\'s createSlice function return?',
        image: null,
        options: [
          'Only action creators',
          'Only the reducer',
          'An object containing the reducer, action creators, and action types',
          'A middleware function',
        ],
        correctAnswer: 'An object containing the reducer, action creators, and action types',
        score: 2,
      },
      {
        id: 'q7',
        type: 'multiSelect',
        text: 'Which events are tracked by the integrity monitoring system in this exam? (Select all that apply)',
        image: null,
        options: ['Tab switching', 'Window blur', 'Keyboard shortcuts', 'Mouse movement', 'Window focus'],
        correctAnswer: ['Tab switching', 'Window blur', 'Window focus'],
        score: 2,
      },
    ],
    userSubmissionTemplate: {
      userName: '',
      deviceFingerprint: '',
      tabExitCount: 0,
      tabReturnCount: 0,
      integrityEvents: [],
      answers: {},
      submittedAt: '',
    },
  },
};

/**
 * Simulate fetching an exam by ID (local mock)
 */
export function getExamById(examId) {
  return EXAMS_DB[examId] || null;
}
