// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // Keep this if you're using a custom domain like vedpanse.com
  plugins: [react()]
})
