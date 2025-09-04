// src/oneSignalService.js
class OneSignalService {
  constructor() {
    this.isInitialized = false;
    this.playerId = null;
  }

  // Wait for OneSignal to be ready (already initialized in HTML)
  async waitForReady() {
    try {
      if (this.isInitialized) {
        console.log('OneSignal already ready');
        return true;
      }

      // Wait for OneSignal to be available
      if (typeof window.OneSignal === 'undefined') {
        console.log('OneSignal not loaded yet, waiting...');
        await this.waitForOneSignal();
      }

      // Wait a bit more for OneSignal to be fully ready
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.isInitialized = true;
      console.log('OneSignal is ready');

      // Get player ID
      this.playerId = await this.getPlayerId();
      console.log('OneSignal Player ID:', this.playerId);

      return true;
    } catch (error) {
      console.error('OneSignal ready check failed:', error);
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

      // Listen for notification received (foreground)
      window.OneSignal.on('notificationDisplay', (event) => {
        console.log('OneSignal notification received (foreground):', event);
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

      // Listen for subscription change
      window.OneSignal.on('subscriptionChange', (isSubscribed) => {
        console.log('OneSignal subscription changed:', isSubscribed);
        if (callback && typeof callback === 'function') {
          callback({
            type: 'subscription',
            data: { isSubscribed },
            timestamp: new Date().toISOString()
          });
        }
      });

      // Also listen for custom events that might be sent from the service worker
      window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'ONESIGNAL_NOTIFICATION') {
          console.log('OneSignal notification received via message:', event.data);
          if (callback && typeof callback === 'function') {
            callback({
              type: 'notification',
              data: event.data.payload,
              timestamp: new Date().toISOString()
            });
          }
        } else if (event.data && event.data.type === 'ONESIGNAL_NOTIFICATION_CLICK') {
          console.log('OneSignal notification clicked via message:', event.data);
          if (callback && typeof callback === 'function') {
            callback({
              type: 'click',
              data: event.data.payload,
              timestamp: new Date().toISOString()
            });
          }
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
