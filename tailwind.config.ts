import { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
					DEFAULT: colors.violet[500],
					dark: colors.violet[700],
        },
        'on-primary': {
          DEFAULT: '#fff',
          dark: '#fff',
        },
        secondary: {
					DEFAULT: colors.orange[500],
					dark: colors.orange[700],
        },
				container: {
					DEFAULT: colors.white,
					dark: "hsl(25,95%,13%)",
				},

        // text-colors
        light: colors.slate[900],
        dark: colors.slate[50],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config

export default config
