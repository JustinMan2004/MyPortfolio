import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relatieve paden: de site werkt zo ook op GitHub Pages, Netlify, Vercel of Render.
  base: './',
  plugins: [react(), tailwindcss()],
});
