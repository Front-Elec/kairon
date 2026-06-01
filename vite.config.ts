import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * manualChunks garantiza que cada página lazy genere
         * su propio archivo .js en el Network tab, facilitando
         * verificar que el code splitting funciona correctamente.
         *
         * Estrategia:
         *  - 'vendor'  → librerías de node_modules (react, react-dom, react-router)
         *  - 'pages'   → todas las páginas de la app (cada una llega como chunk separado
         *               porque están envueltas en React.lazy en AppRouter)
         */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Agrupar react-router en su propio chunk
            if (id.includes('react-router') || id.includes('@remix-run')) {
              return 'vendor-router';
            }
            // El resto de dependencias en un chunk vendor genérico
            return 'vendor';
          }
          // Las páginas lazy se dividen automáticamente por Rollup;
          // no hace falta forzarlas aquí, pero podemos nombrar el grupo.
          if (id.includes('/src/pages/')) {
            // Rollup creará un chunk por cada import() dinámico —
            // retornar undefined aquí deja que Rollup los nombre solo.
            return undefined;
          }
        },
      },
    },
  },
})