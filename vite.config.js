import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // CSS files from src/styles
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.includes('src/styles')) {
            return 'assets/css/[name].[hash][extname]';
          }
          // Images from src/assets
          if (assetInfo.name.includes('src/assets')) {
            return 'assets/images/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
});