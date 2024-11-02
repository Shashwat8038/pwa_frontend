
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';


const firebaseConfig = {
    apiKey: "AIzaSyCCvBzkUColukhHiPtuAKl4oqNkRfgmmy4",
    authDomain: "imp-pwa.firebaseapp.com",
    projectId: "imp-pwa",
    storageBucket: "imp-pwa.firebasestorage.app",
    messagingSenderId: "137270323444",
    appId: "1:137270323444:web:fb4071b653f3b6cd6916a1",
    measurementId: "G-38JCFB42MM"
  };


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
