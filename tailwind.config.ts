import type { Config } from 'tailwindcss';

// Palette inspirée du drapeau ivoirien : orange (savane), blanc (paix), vert (forêt).
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--police-texte)', 'system-ui', 'sans-serif'],
        titre: ['var(--police-titre)', 'Georgia', 'serif'],
      },
      colors: {
        marque: {
          50: '#fff5eb',
          100: '#ffe6cc',
          200: '#ffc999',
          300: '#ffa75c',
          400: '#ff8f2e',
          500: '#f77f00',
          600: '#d96a00',
          700: '#b35500',
          800: '#8a4206',
          900: '#6b3509',
        },
        foret: {
          50: '#e8f7ef',
          100: '#c7ecd8',
          200: '#8fd8b1',
          300: '#4fc085',
          400: '#1aab62',
          500: '#009e60',
          600: '#007f4d',
          700: '#00663f',
          800: '#054f33',
          900: '#06402b',
        },
        ivoire: '#fbf6ee',
        terre: '#3b2a1e',
        mtn: '#ffcc00',
        orange: '#ff7900',
        wave: '#1dc8ff',
        moov: '#0a5cb8',
      },
      boxShadow: {
        carte: '0 1px 2px rgba(59,42,30,.06), 0 4px 14px -6px rgba(59,42,30,.18)',
        premium: '0 22px 60px -26px rgba(59,42,30,.45)',
        halo: '0 0 0 1px rgba(247,127,0,.18), 0 14px 40px -18px rgba(247,127,0,.45)',
      },
      keyframes: {
        defile: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        scintille: { '0%,100%': { opacity: '.35' }, '50%': { opacity: '1' } },
        flotte: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        defile: 'defile 30s linear infinite',
        scintille: 'scintille 2.4s ease-in-out infinite',
        flotte: 'flotte 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
