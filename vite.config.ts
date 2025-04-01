import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env file
dotenv.config()

// Get base path from environment variables
const basePath = process.env.VITE_APP_BASE_URL || '/rvnugorg_rewrite2025';

// Feature flag configuration
const isCommunityShowcaseEnabled = process.env.VITE_FEATURE_COMMUNITY_SHOWCASE === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  base: basePath,
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure Vite copies files from public to dist
    assetsDir: 'assets',
    rollupOptions: {
      // Exclude files when feature flag is disabled
      external: !isCommunityShowcaseEnabled ? [
        '**/CommunityShowcasePage.*',
        '**/projects.json'
      ] : []
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Configure public directory
  publicDir: resolve(__dirname, 'public'),
}) 