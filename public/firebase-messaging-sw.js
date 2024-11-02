// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.9.1/firebase-messaging-compat.js');

firebase.initializeApp({
  
        apiKey: "AIzaSyCCvBzkUColukhHiPtuAKl4oqNkRfgmmy4",
        authDomain: "imp-pwa.firebaseapp.com",
        projectId: "imp-pwa",
        storageBucket: "imp-pwa.firebasestorage.app",
        messagingSenderId: "137270323444",
        appId: "1:137270323444:web:fb4071b653f3b6cd6916a1",
        measurementId: "G-38JCFB42MM"
      
});


const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
  





messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
