/** @type {import('tailwindcss').Config} */
import baseTailwindConfig from './tailwind.config'
export default {
  presets: [baseTailwindConfig],
  content: ['node_modules/ui/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    keyframes: {
      load: {
        '0%, 100%': { transform: 'scale(1.5)', backgroundColor: 'lightgreen' },
        '50%': { transform: 'scale(0.8)', backgroundColor: 'lightblue' }
      },
      square: {
        '0%': { transform: 'translateY(0)' },
        '100%': { transform: 'translateY(-500) rotate(600deg)', bottom: '800px' }
      }
    },
    animation: {
      scale: 'load 1s ease infinite',
      'scale-1.2': 'load 1.2s ease infinite',
      'scale-1.4': 'load 1.4s ease infinite',
      'scale-1.6': 'load 1.6s ease infinite',
      'scale-1.8': 'load 1.8s ease infinite',
      square: 'square 30s infinite'
    }
  }
}
