import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { animate } from 'framer-motion'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tailwindcss-animate()],
})
