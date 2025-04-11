import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// Load environment variables from .env file
dotenv.config()

// Get base path from environment variables
const basePath = process.env.VITE_APP_BASE_URL || '/rvnugorg_rewrite2025';

// Feature flag configuration
const isCommunityShowcaseEnabled = process.env.VITE_FEATURE_COMMUNITY_SHOWCASE === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.png', '**/*.svg', '**/*.gif', '**/*.webp'],
  plugins: [
    react({
      jsxImportSource: 'react',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    }),
    ViteImageOptimizer({
      png: {
        quality: 80,
        compressionLevel: 7,
      },
      jpeg: {
        quality: 80,
        progressive: true,
      },
      jpg: {
        quality: 80,
        progressive: true,
      },
      gif: {
        optimizationLevel: 7,
        interlaced: false,
      },
      webp: {
        quality: 80,
        lossless: false,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                removeEmptyAttrs: false,
              },
            },
          },
        ],
      },
      // Only process image files and exclude problematic ones
      include: [
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.gif',
        '**/*.svg',
        '**/*.webp',
      ],
      exclude: [
        'images/IMG_4105.jpeg', 
        'images/IMG_4105 (1).jpeg',
        'images/team/62387302.jpeg'
      ]
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Roanoke Valley .NET User Group (RVNUG)',
          description: 'The Roanoke Valley .NET User Group (RVNUG) is a community of developers passionate about .NET technologies in the Roanoke Valley area.',
        },
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 
        'robots.txt', 
        'apple-touch-icon.png',
        'images/*.png',
        'images/*.svg'
      ],
      manifest: {
        name: 'Roanoke Valley .NET User Group',
        short_name: 'RVNUG',
        description: 'The Roanoke Valley .NET User Group (RVNUG) is a community of developers passionate about .NET technologies in the Roanoke Valley area.',
        theme_color: '#5c2d91',
        background_color: '#ffffff',
        icons: [
          {
            src: '/images/roanoke-star-128-logo.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: basePath,
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      external: !isCommunityShowcaseEnabled ? [
        '**/CommunityShowcasePage.*',
        '**/projects.json'
      ] : [],
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['react-helmet-async', 'react-icons']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(woff|woff2|eot|ttf|otf)$/.test(name ?? '')) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[ext]/[name]-[hash][extname]';
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  publicDir: resolve(__dirname, 'public'),
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  }
}) 