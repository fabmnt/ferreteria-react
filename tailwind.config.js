import flowbite from 'flowbite-react/tailwind'

/** @type {import('tailwindcss').Config} */
export const darkMode = 'class'
export const content = ['./src/index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content()]
export const theme = {
  extend: {},
}
export const plugins = [flowbite.plugin()]
