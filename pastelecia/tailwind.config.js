/** @type {import('tailwindcss').Config} */

export default {

  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {

    extend: {

      colors: {

        brand: {

          greenDark: '#769826',

          green: '#A1CB35',

          yellow: '#FFDE4E',

          orange: '#FF9D4D',

        },

        paper: {

          DEFAULT: '#FFFCF5',

          dim: '#F7F2E7',

        },

        ink: {

          DEFAULT: '#211F1A',

          soft: '#4A473E',

          faint: '#8A8578',

        },

      },

      fontFamily: {

        display: ['"Clash Display"', 'sans-serif'],

        body: ['"Satoshi"', 'ui-sans-serif', 'system-ui', 'sans-serif'],

        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],

      },

      borderRadius: {

        xl2: '1.25rem',

      },

      boxShadow: {

        soft: '0 8px 30px -8px rgba(33, 31, 26, 0.15)',

        ticket: '0 12px 40px -12px rgba(33, 31, 26, 0.35)',

      },

      backgroundImage: {

        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",

      },

      keyframes: {

        'tear-in': {

          '0%': { transform: 'translateY(-8px)', opacity: '0' },

          '100%': { transform: 'translateY(0)', opacity: '1' },

        },

        'pop': {

          '0%': { transform: 'scale(0.9)' },

          '50%': { transform: 'scale(1.06)' },

          '100%': { transform: 'scale(1)' },

        },

        'marquee': {

          '0%': { transform: 'translateX(0%)' },

          '100%': { transform: 'translateX(-50%)' },

        },

      },

      animation: {

        'tear-in': 'tear-in 0.4s ease-out',

        'pop': 'pop 0.35s ease-out',

        'marquee': 'marquee 22s linear infinite',

      },

    },

  },

  plugins: [],

}
