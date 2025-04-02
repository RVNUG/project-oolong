import { registerSW } from 'virtual:pwa-register';

export const registerServiceWorker = () => {
  // Skip registration in development mode
  if (import.meta.env.DEV) {
    console.log('Service worker registration skipped in development mode');
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
        console.log('Site is ready for offline use');
      },
      onRegistered(swRegistration: ServiceWorkerRegistration | undefined) {
        // Registration was successful
        console.log('Service worker registered:', swRegistration);
      },
      onRegisterError(error: any) {
        console.error('Service worker registration failed:', error);
      }
    });
  }
}; 