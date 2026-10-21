import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' so the build runs from any XAMPP htdocs subfolder
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
