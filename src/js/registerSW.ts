import { registerSW } from 'virtual:pwa-register';

export const registerServiceWorker = () => {
  // Skip registration in development mode
  if (import.meta.env.DEV) {
    return;
  }

  if ('serviceWorker' in navigator) {
    // Register the service worker
    const updateSW = registerSW({
      onNeedRefresh() {
        // Show a UI to prompt the user to refresh for new content
        if (confirm('New content available. Reload?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        // Notify user that site is ready for offline use
      },
      onRegistered(_swRegistration: ServiceWorkerRegistration | undefined) {
        // Registration was successful
      },
      onRegisterError(error: Error | unknown) {
        console.error('Service worker registration failed:', error);
      }
    });
  }
}; 