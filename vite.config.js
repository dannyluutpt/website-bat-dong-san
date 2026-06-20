import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Đường dẫn tương đối để tương thích mọi môi trường deploy (GitHub Pages, Docker, Vercel)
})
