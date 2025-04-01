import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Handle .css files separately
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name].[hash].[ext]';
          }

          // Ensure all assets like SVG, PNG, JPG, WebP are handled in the assets folder
          if (assetInfo.name.match(/\.(svg|jpg|jpeg|png|webp)$/)) {
            return 'assets/[name].[hash].[ext]';
          }

          // Default for other assets
          return 'assets/[name].[ext]';
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
