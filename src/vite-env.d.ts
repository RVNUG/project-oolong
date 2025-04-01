/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_APP_BASE_URL?: string;
    readonly VITE_APP_MEETUP_GROUP_NAME?: string;
    readonly VITE_APP_CORS_PROXY?: string;
    readonly PROD: boolean;
    readonly DEV: boolean;
    [key: string]: string | boolean | undefined;
  };
} 