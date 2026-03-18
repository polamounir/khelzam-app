export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        exam: {
          bg: 'var(--exam-bg)',
          surface: 'var(--exam-surface)',
          card: 'var(--exam-card)',
          border: 'var(--exam-border)',
          accent: 'var(--exam-accent)',
          'accent-hover': 'var(--exam-accent-hover)',
          'accent-light': 'var(--exam-accent-light)',
          success: 'var(--exam-success)',
          warning: 'var(--exam-warning)',
          danger: 'var(--exam-danger)',
          text: 'var(--exam-text)',
          muted: 'var(--exam-muted)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
  // Trigger rebuild for Header and Light Mode CSS
}
