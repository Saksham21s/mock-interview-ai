import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name].[hash].[ext]';
          }
          if (/\.(svg|jpg|jpeg|png|webp)$/.test(assetInfo.name)) {
            return 'assets/images/[name].[hash].[ext]';
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  },
  server: {
    assetsInclude: ['**/*.svg', '**/*.webp']
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    }
  }
});
