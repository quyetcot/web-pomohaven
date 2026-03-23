import formsPlugin from '@tailwindcss/forms';
import containerQueriesPlugin from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#adc6ff',
          glow: '#4b8eff',
        },
        tertiary: '#ffb595',
        void: '#10131a',
        surface: {
          DEFAULT: '#191c22',
          container: '#272a31',
          floating: '#363940',
          variant: '#32353c',
        },
        muted: '#c1c6d7'
      },
    },
  },
  plugins: [
    formsPlugin,
    containerQueriesPlugin,
  ],
}
