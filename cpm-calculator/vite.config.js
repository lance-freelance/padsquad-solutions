import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/cpm-calculator/',
  server: {
    host: true,
    port: parseInt(process.env.PORT) || 5174,
    strictPort: false,
  },
})
