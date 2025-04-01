import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (/\.(css)$/.test(assetInfo.name)) {
            return 'assets/css/[name].[hash][extname]';
          }
          if (/\.(svg|png|jpg|jpeg|webp|gif)$/.test(assetInfo.name)) {
            return 'assets/[name].[hash][extname]'; 
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
