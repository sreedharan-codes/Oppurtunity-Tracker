/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a5f7',
          500: '#0071e3', // Canonical Apple Blue
          600: '#0062c4',
          700: '#004fa1',
          800: '#034484',
          900: '#08396e',
          DEFAULT: '#0071e3',
        },
        dark: {
          bg: '#08090d',
          surface: '#12141c',
          border: 'rgba(255, 255, 255, 0.08)',
          card: 'rgba(18, 20, 29, 0.65)',
        },
        light: {
          bg: '#f8f9fa',
          surface: '#ffffff',
          border: 'rgba(0, 0, 0, 0.08)',
          card: 'rgba(255, 255, 255, 0.75)',
        },
        flux: {
          dark: '#141518',
          darker: '#0e0f12',
          cardDark: '#17181c',
          lime: '#d8ff3e',
          limeDark: '#b2d920',
          lavender: '#b5b6ff',
          lavenderLight: '#e4e5ff',
          canvas: '#eaebef',
          muted: '#8b8f9a',
          card: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"SF Pro Display"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'button': '14px',
        'card': '24px',
        'modal': '28px',
        'badge': '10px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'glass-hover': '0 16px 48px 0 rgba(0, 0, 0, 0.35)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'subtle': '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
        'glow': '0 0 40px -10px rgba(0, 113, 227, 0.35)',
        'dock': '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'dock-light': '0 20px 50px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'fade-up': 'fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'progress': 'progress 1.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
