import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'
import viteImagemin from 'vite-plugin-imagemin'

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
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
        progressive: true
      },
      pngquant: {
        quality: [0.7, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
      // Only process image files and exclude problematic ones
      filter: (file) => {
        // Check if the file is an image based on extension
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
        const isImage = imageExtensions.some(ext => file.toLowerCase().endsWith(ext));
        
        // If it's not an image, don't process it
        if (!isImage) {
          return false;
        }
        
        // Exclude specific problematic files that cause errors
        const excludeList = [
          'images/IMG_4105.jpeg', 
          'images/IMG_4105 (1).jpeg'
        ];
        
        // Return false for files that should be excluded
        for (const excludePath of excludeList) {
          if (file.includes(excludePath)) {
            return false;
          }
        }
        
        // Process the image
        return true;
      }
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
        'src/assets/images/*.png',
        'src/assets/images/*.svg'
      ],
      manifest: {
        name: 'Roanoke Valley .NET User Group',
        short_name: 'RVNUG',
        description: 'The Roanoke Valley .NET User Group (RVNUG) is a community of developers passionate about .NET technologies in the Roanoke Valley area.',
        theme_color: '#5c2d91',
        background_color: '#ffffff',
        icons: [
          {
            src: 'src/assets/images/roanoke-star-128-logo.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'src/assets/images/roanoke-star-128-logo.png',
            sizes: '512x512',
            type: 'image/png'
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