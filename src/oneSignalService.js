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
        // Still try to get playerId in case it wasn't set before
        if (!this.playerId) {
          this.playerId = await this.getPlayerId();
          console.log('OneSignal Player ID (retrieved on ready check):', this.playerId);
        }
        return true;
      }

      // Wait for OneSignal to be available
      if (typeof window.OneSignal === 'undefined') {
        console.log('OneSignal not loaded yet, waiting...');
        await this.waitForOneSignal();
      }

      // Wait for OneSignal to be fully initialized with all methods available
      await this.waitForOneSignalReady();

      this.isInitialized = true;
      console.log('OneSignal is ready');

      // Get player ID with retry logic
      this.playerId = await this.getPlayerIdWithRetry();
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

  // Wait for OneSignal to be fully ready with all methods available
  waitForOneSignalReady() {
    return new Promise((resolve) => {
      const checkOneSignalReady = () => {
        if (typeof window.OneSignal !== 'undefined' && 
            typeof window.OneSignal.getUserId === 'function' &&
            typeof window.OneSignal.on === 'function') {
          resolve();
        } else {
          setTimeout(checkOneSignalReady, 100);
        }
      };
      checkOneSignalReady();
    });
  }

  // Get player ID
  async getPlayerId() {
    try {
      // Check if OneSignal is available
      if (typeof window.OneSignal === 'undefined') {
        console.log('OneSignal not loaded yet');
        return null;
      }

      // Check if getUserId method is available
      if (typeof window.OneSignal.getUserId !== 'function') {
        console.log('OneSignal.getUserId method not available yet');
        return null;
      }

      const playerId = await window.OneSignal.getUserId();
      console.log('Retrieved player ID:', playerId);
      
      // Update the instance playerId if we got a valid one
      if (playerId) {
        this.playerId = playerId;
      }
      
      return playerId;
    } catch (error) {
      console.error('Error getting player ID:', error);
      return null;
    }
  }

  // Get player ID with retry logic
  async getPlayerIdWithRetry(maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`Attempting to get player ID (attempt ${attempt}/${maxRetries})`);
      
      const playerId = await this.getPlayerId();
      if (playerId) {
        console.log(`Successfully retrieved player ID on attempt ${attempt}:`, playerId);
        return playerId;
      }
      
      if (attempt < maxRetries) {
        console.log(`Player ID not available, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      }
    }
    
    console.warn(`Failed to retrieve player ID after ${maxRetries} attempts`);
    return null;
  }

  // Manually refresh player ID
  async refreshPlayerId() {
    console.log('Manually refreshing player ID...');
    this.playerId = await this.getPlayerIdWithRetry();
    return this.playerId;
  }

  // Get current player ID (synchronous)
  getCurrentPlayerId() {
    return this.playerId;
  }

  // Test notification detection
  testNotificationDetection() {
    console.log('🧪 Testing notification detection...');
    console.log('OneSignal available:', typeof window.OneSignal !== 'undefined');
    console.log('OneSignal.on available:', typeof window.OneSignal?.on === 'function');
    console.log('isInitialized:', this.isInitialized);
    console.log('playerId:', this.playerId);
    console.log('Notification permission:', Notification?.permission);
    
    // Test if we can access OneSignal methods
    if (typeof window.OneSignal !== 'undefined') {
      console.log('OneSignal methods available:', Object.keys(window.OneSignal));
    }
    
    return {
      oneSignalAvailable: typeof window.OneSignal !== 'undefined',
      oneSignalOnAvailable: typeof window.OneSignal?.on === 'function',
      isInitialized: this.isInitialized,
      playerId: this.playerId,
      notificationPermission: Notification?.permission
    };
  }

  // Force setup notification listeners (useful for debugging)
  forceSetupNotificationListeners(callback) {
    console.log('🔄 Force setting up notification listeners...');
    this.setupNotificationListeners(callback);
    this.setupBasicNotificationListeners(callback);
    this.setupAdditionalNotificationListeners(callback);
    this.setupStandardNotificationListeners(callback);
  }

  // Set up notification event listeners
  setupNotificationListeners(callback) {
    try {
      console.log('Setting up OneSignal notification listeners...');
      console.log('OneSignal available:', typeof window.OneSignal !== 'undefined');
      console.log('OneSignal.on available:', typeof window.OneSignal?.on === 'function');
      console.log('isInitialized:', this.isInitialized);

      if (!this.isInitialized) {
        console.log('OneSignal not initialized, setting up basic listeners');
        this.setupBasicNotificationListeners(callback);
        return;
      }

      // Check if OneSignal.on method is available
      if (typeof window.OneSignal.on !== 'function') {
        console.log('OneSignal.on method not available yet, setting up basic listeners');
        this.setupBasicNotificationListeners(callback);
        return;
      }

      // Listen for notification received (foreground)
      window.OneSignal.on('notificationDisplay', (event) => {
        console.log('🔔 OneSignal notification received (foreground):', event);
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
        console.log('👆 OneSignal notification clicked:', event);
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
        console.log('📱 OneSignal subscription changed:', isSubscribed);
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
        console.log('📨 Message received:', event.data);
        if (event.data && event.data.type === 'ONESIGNAL_NOTIFICATION') {
          console.log('🔔 OneSignal notification received via message:', event.data);
          if (callback && typeof callback === 'function') {
            callback({
              type: 'notification',
              data: event.data.payload,
              timestamp: new Date().toISOString()
            });
          }
        } else if (event.data && event.data.type === 'ONESIGNAL_NOTIFICATION_CLICK') {
          console.log('👆 OneSignal notification clicked via message:', event.data);
          if (callback && typeof callback === 'function') {
            callback({
              type: 'click',
              data: event.data.payload,
              timestamp: new Date().toISOString()
            });
          }
        }
      });

      // Add additional event listeners for different OneSignal events
      this.setupAdditionalNotificationListeners(callback);

      console.log('✅ OneSignal notification listeners set up successfully');
    } catch (error) {
      console.error('❌ Error setting up notification listeners:', error);
    }
  }

  // Set up basic notification listeners when OneSignal.on is not available
  setupBasicNotificationListeners(callback) {
    try {
      console.log('Setting up basic notification listeners');
      
      // Listen for custom events that might be sent from the service worker
      window.addEventListener('message', (event) => {
        console.log('📨 Basic message received:', event.data);
        if (event.data && event.data.type === 'ONESIGNAL_NOTIFICATION') {
          console.log('🔔 OneSignal notification received via message:', event.data);
          if (callback && typeof callback === 'function') {
            callback({
              type: 'notification',
              data: event.data.payload,
              timestamp: new Date().toISOString()
            });
          }
        } else if (event.data && event.data.type === 'ONESIGNAL_NOTIFICATION_CLICK') {
          console.log('👆 OneSignal notification clicked via message:', event.data);
          if (callback && typeof callback === 'function') {
            callback({
              type: 'click',
              data: event.data.payload,
              timestamp: new Date().toISOString()
            });
          }
        }
      });

      // Also listen for standard notification events
      this.setupStandardNotificationListeners(callback);

      console.log('✅ Basic notification listeners set up successfully');
    } catch (error) {
      console.error('❌ Error setting up basic notification listeners:', error);
    }
  }

  // Set up additional notification listeners for different OneSignal events
  setupAdditionalNotificationListeners(callback) {
    try {
      console.log('Setting up additional OneSignal event listeners...');

      // Listen for all available OneSignal events
      const events = [
        'notificationDisplay',
        'notificationClick', 
        'subscriptionChange',
        'permissionPromptDisplay',
        'permissionPromptDismiss',
        'permissionPromptGrant',
        'permissionPromptDeny'
      ];

      events.forEach(eventName => {
        if (typeof window.OneSignal.on === 'function') {
          window.OneSignal.on(eventName, (data) => {
            console.log(`🎯 OneSignal ${eventName} event:`, data);
            if (callback && typeof callback === 'function') {
              callback({
                type: eventName,
                data: data,
                timestamp: new Date().toISOString()
              });
            }
          });
        }
      });

      console.log('✅ Additional OneSignal event listeners set up');
    } catch (error) {
      console.error('❌ Error setting up additional notification listeners:', error);
    }
  }

  // Set up standard browser notification listeners
  setupStandardNotificationListeners(callback) {
    try {
      console.log('Setting up standard browser notification listeners...');

      // Listen for notification permission changes
      if ('Notification' in window) {
        // Listen for permission changes
        const checkPermission = () => {
          const permission = Notification.permission;
          console.log('🔔 Notification permission changed:', permission);
          if (callback && typeof callback === 'function') {
            callback({
              type: 'permission',
              data: { permission },
              timestamp: new Date().toISOString()
            });
          }
        };

        // Check permission initially
        checkPermission();

        // Listen for focus events that might indicate notification interaction
        window.addEventListener('focus', () => {
          console.log('🔄 Window focused - checking for notification interactions');
          checkPermission();
        });
      }

      // Listen for service worker messages
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('📨 Service worker message:', event.data);
          if (event.data && event.data.type && event.data.type.includes('notification')) {
            if (callback && typeof callback === 'function') {
              callback({
                type: 'serviceWorker',
                data: event.data,
                timestamp: new Date().toISOString()
              });
            }
          }
        });
      }

      console.log('✅ Standard notification listeners set up');
    } catch (error) {
      console.error('❌ Error setting up standard notification listeners:', error);
    }
  }
}

// Create and export a singleton instance
const oneSignalService = new OneSignalService();
export default oneSignalService;
