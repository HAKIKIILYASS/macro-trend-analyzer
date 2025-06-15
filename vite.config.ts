
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      // Reduce file watching to prevent EMFILE errors
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.env*',
        '**/coverage/**',
        '**/.nyc_output/**',
        '**/test-results/**',
        '**/playwright-report/**',
        '**/.cache/**',
        '**/tmp/**',
        '**/temp/**'
      ],
      // Use polling as fallback and reduce frequency
      usePolling: process.env.NODE_ENV === 'development',
      interval: 1000,
      binaryInterval: 3000
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimize build to reduce file operations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast']
        }
      }
    }
  }
}));
