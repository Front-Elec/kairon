// import { defineConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Target navegadores modernos: genera código más liviano sin polyfills innecesarios
    target: 'esnext',
    // Alerta si un chunk supera 500kb
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        /**
         * manualChunks: separa vendors de páginas para maximizar
         * el cache hit entre deploys.
         *
         *  - 'vendor-react'  → react + react-dom (chunk más pesado y estable)
         *  - 'vendor-router' → react-router + @remix-run
         *  - 'vendor'        → resto de node_modules
         *  - páginas lazy    → Rollup las nombra automáticamente por import()
         */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || (id.includes('react') && !id.includes('react-router'))) {
              return 'vendor-react';
            }
            if (id.includes('react-router') || id.includes('@remix-run')) {
              return 'vendor-router';
            }
            return 'vendor';
          }
        },
      },
    },
  },
})
