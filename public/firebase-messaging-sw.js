// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

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

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
