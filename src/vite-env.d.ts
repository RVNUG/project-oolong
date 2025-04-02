/// <reference types="vite/client" />

// Vite PWA types
declare module 'virtual:pwa-register' {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: any) => void;
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

// Common image formats
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module '*.webp';
declare module '*.avif';

// Environment variables
interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_FEATURE_COMMUNITY_SHOWCASE: string;
  readonly VITE_APP_MEETUP_GROUP_NAME?: string;
  readonly VITE_APP_CORS_PROXY?: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 