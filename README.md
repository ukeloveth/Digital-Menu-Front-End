# QR Code Food Delivery App

A React-based food delivery application with QR code functionality and push notifications.

## Firebase Configuration

This app uses Firebase for push notifications. You need to set up the following environment variables:

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Firebase VAPID Key (Required for push notifications)
# Get this from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### How to Get Firebase VAPID Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Click on "Cloud Messaging" tab
5. Scroll down to "Web Push certificates"
6. Generate a new key pair if you don't have one
7. Copy the "Key pair" value - this is your VAPID key

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Push Notification Troubleshooting

### Common Issues and Solutions

1. **"This browser does not support notifications"**
   - Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)
   - Ensure the site is served over HTTPS (required for notifications)

2. **"Service worker registration failed"**
   - Check that `public/firebase-messaging-sw.js` exists
   - Verify the service worker path in `getFcmToken.js`
   - Clear browser cache and reload

3. **"No registration token available"**
   - Ensure you have the correct VAPID key in your `.env` file
   - Check that Firebase project settings match your environment variables
   - Verify notification permissions are granted

4. **Notifications not showing**
   - Check browser console for errors
   - Use the "Test FCM Setup" button in AdminView to debug
   - Verify service worker is active in browser dev tools

### Testing Push Notifications

1. Use the "Test FCM Setup" button in the AdminView to verify configuration
2. Check browser console for detailed logs
3. Verify service worker registration in browser dev tools > Application > Service Workers
4. Test with a simple notification payload from your backend

### Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Limited support (requires user interaction)
- **Edge**: Full support
