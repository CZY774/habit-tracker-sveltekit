import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom color extensions if needed
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideInUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideInUp: {
          from: {
            transform: 'translateY(30px)',
            opacity: '0'
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        bounceIn: {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(1.05)'
          },
          '70%': {
            transform: 'scale(0.9)'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        wiggle: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-3px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(3px)' }
        }
      }
    }
  },
  plugins: []
};

export default config;