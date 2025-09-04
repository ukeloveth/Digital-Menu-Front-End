importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// OneSignal service worker configuration
// The OneSignal SDK will automatically handle push notifications
// when properly initialized in your main application

// Listen for notification received in service worker
self.addEventListener('notificationreceived', function(event) {
  console.log('OneSignal notification received in service worker:', event);
  
  // Send message to main thread
  self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      client.postMessage({
        type: 'ONESIGNAL_NOTIFICATION',
        payload: {
          title: event.notification.title,
          body: event.notification.body,
          data: event.notification.data,
          tag: event.notification.tag,
          icon: event.notification.icon
        }
      });
    });
  });
});

// Listen for notification click in service worker
self.addEventListener('notificationclick', function(event) {
  console.log('OneSignal notification clicked in service worker:', event);
  
  // Send message to main thread
  self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      client.postMessage({
        type: 'ONESIGNAL_NOTIFICATION_CLICK',
        payload: {
          title: event.notification.title,
          body: event.notification.body,
          data: event.notification.data,
          tag: event.notification.tag,
          icon: event.notification.icon
        }
      });
    });
  });
  
  // Close the notification
  event.notification.close();
});