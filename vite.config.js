import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    host: true, // Allows external access to your local server
    port: 3000, // The port the development server will run on
  },
  resolve: {
    alias: {
      '@': '/src', // Shortcut for importing from the src folder
    },
  },
  build: {
    outDir: 'dist', // Output directory for the build files
    sourcemap: true, // Enable source maps for debugging
  },
});
