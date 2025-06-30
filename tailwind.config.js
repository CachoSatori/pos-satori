/** @type {import('tailwindcss').Config} */
     export default {
       content: ['./src/**/*.{js,jsx,ts,tsx}'],
       theme: {
         extend: {
           colors: {
             primary: '#1C2526',
             secondary: '#2D3A3A',
             accent: '#00A6A6',
             text: '#FFFFFF',
             danger: '#EF4444',
           },
         },
       },
       plugins: [],
     };