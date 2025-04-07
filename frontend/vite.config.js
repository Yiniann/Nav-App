import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 新增配置
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    assetsDir: 'assets', 
    outDir: '../dist', 
    emptyOutDir: true, 
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})