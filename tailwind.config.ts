import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FCFCF8',
          100: '#F4F4EC',
          200: '#EAE9DD',
          300: '#DDDCCB',
          400: '#CCC9B3',
        },
        ink: {
          50: '#EFF4F7',
          100: '#D8E3EA',
          200: '#B3C7D6',
          300: '#8DAFC0',
          400: '#6990A5',
          500: '#4E7489',
          600: '#3C5F71',
          700: '#2B4D61',
          800: '#243E52',
          900: '#1C3444',
        },
        brand: {
          50: '#ECF8F8',
          100: '#D6F0F1',
          200: '#B5E3E5',
          300: '#86D0D4',
          400: '#5CB4B4',
          500: '#44A4AC',
          600: '#3C9CA4',
          700: '#2E838A',
          800: '#276E74',
          900: '#235C62',
        },
      },
      boxShadow: {
        card: '0 18px 50px -35px rgb(28 52 68 / 0.30)',
        soft: '0 12px 30px -22px rgb(28 52 68 / 0.30)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [forms],
} satisfies Config
