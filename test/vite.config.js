import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/test/', // This should match your repository name if it's a project page
  plugins: [react()],
});