// src/oneSignalService.js
class OneSignalService {
  constructor() {
    this.isInitialized = false;
    this.playerId = null;
  }

  // Initialize OneSignal
  async initialize() {
    try {
      if (this.isInitialized) {
        console.log('OneSignal already initialized');
        return true;
      }

      // Wait for OneSignal to be available
      if (typeof window.OneSignal === 'undefined') {
        console.log('OneSignal not loaded yet, waiting...');
        await this.waitForOneSignal();
      }

      // Initialize OneSignal
      await window.OneSignal.init({
        appId: "9814adb8-df1e-48f2-8fb6-918300827d86",
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        serviceWorkerParam: { scope: "/" },
        allowLocalhostAsSecureOrigin: true,
        autoRegister: true,
        autoResubscribe: true,
      });

      this.isInitialized = true;
      console.log('OneSignal initialized successfully');

      // Get player ID
      this.playerId = await this.getPlayerId();
      console.log('OneSignal Player ID:', this.playerId);

      return true;
    } catch (error) {
      console.error('OneSignal initialization failed:', error);
      return false;
    }
  }

  // Wait for OneSignal to be available
  waitForOneSignal() {
    return new Promise((resolve) => {
      const checkOneSignal = () => {
        if (typeof window.OneSignal !== 'undefined') {
          resolve();
        } else {
          setTimeout(checkOneSignal, 100);
        }
      };
      checkOneSignal();
    });
  }

  // Get player ID
  async getPlayerId() {
    try {
      if (!this.isInitialized) {
        console.log('OneSignal not initialized');
        return null;
      }

      const playerId = await window.OneSignal.getUserId();
      return playerId;
    } catch (error) {
      console.error('Error getting player ID:', error);
      return null;
    }
  }

  // Set up notification event listeners
  setupNotificationListeners(callback) {
    try {
      if (!this.isInitialized) {
        console.log('OneSignal not initialized');
        return;
      }

      // Listen for notification received
      window.OneSignal.on('notificationDisplay', (event) => {
        console.log('OneSignal notification received:', event);
        if (callback && typeof callback === 'function') {
          callback({
            type: 'notification',
            data: event,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Listen for notification click
      window.OneSignal.on('notificationClick', (event) => {
        console.log('OneSignal notification clicked:', event);
        if (callback && typeof callback === 'function') {
          callback({
            type: 'click',
            data: event,
            timestamp: new Date().toISOString()
          });
        }
      });

      console.log('OneSignal notification listeners set up successfully');
    } catch (error) {
      console.error('Error setting up notification listeners:', error);
    }
  }
}

// Create and export a singleton instance
const oneSignalService = new OneSignalService();
export default oneSignalService;
