import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Vercel uses root domain, GitHub Pages uses '/selected-longterm-sticks-tracker/'
})

