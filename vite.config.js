import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,

    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',

        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['@tanstack/react-router'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-slot', '@radix-ui/react-label'],
          'radix-vendor': ['@radix-ui/react-avatar', '@radix-ui/react-popover', '@radix-ui/react-select'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers'],
          'query-vendor': ['@tanstack/react-query'],
          validation: ['zod'],
          'date-vendor': ['date-fns'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          utils: ['clsx', 'class-variance-authority', 'tailwind-merge'],
        },
      },
      treeshake: {
        preset: 'recommended',
        manualPureFunctions: ['console.log', 'console.warn', 'console.error'],
      },
    },

    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.warn', 'console.error'],
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
      },
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
  },
  server: {
    fs: {
      cachedChecks: false,
    },
  },
  experimental: {
    renderBuiltUrl(filename) {
      return `/${filename}`;
    },
  },
});
