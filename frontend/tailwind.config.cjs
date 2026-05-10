/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          600: '#4f46e5',
          700: '#4338ca'
        },
        teal: {
          50: '#f0fdfa',
          600: '#0d9488',
          700: '#0f766e'
        }
      },
      boxShadow: {
        'sm-glow': '0 2px 8px rgba(13, 148, 136, 0.15)',
        'md-glow': '0 4px 16px rgba(13, 148, 136, 0.2)',
        'lg-glow': '0 8px 32px rgba(13, 148, 136, 0.25)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 24px rgba(0, 0, 0, 0.1)',
        'elevation': '0 4px 12px rgba(0, 0, 0, 0.08)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.4s ease',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      }
    }
  },
  plugins: []
};
