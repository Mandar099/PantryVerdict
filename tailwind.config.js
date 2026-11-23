/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: {
          DEFAULT: '#FAF8F5',
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#ECE4DC',
        },
        castiron: {
          DEFAULT: '#18181B',
          50: '#71717A',
          100: '#52525B',
          800: '#27272A',
          900: '#18181B',
        },
        olive: {
          DEFAULT: '#2D5A27',
          50: '#F2F7F1',
          100: '#E2EFE0',
          600: '#264D21',
          700: '#1F3F1B',
        },
        turmeric: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          600: '#B45309',
        },
        terracotta: {
          DEFAULT: '#C2410C',
          50: '#FFF7ED',
          100: '#FFEDD5',
          600: '#9A3412',
        },
        hairline: '#E2DDD5',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        editorial: '0 8px 30px rgba(24, 24, 27, 0.06), 0 1px 3px rgba(24, 24, 27, 0.04)',
        dock: '0 20px 40px -10px rgba(24, 24, 27, 0.2), 0 0 0 1px rgba(24, 24, 27, 0.06)',
      },
    },
  },
  plugins: [],
}
