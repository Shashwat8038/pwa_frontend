import React, { useEffect, useState, useRef } from 'react';
import { messaging, getToken, onMessage } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
    const [fcmToken, setFcmToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const listenerInitialized = useRef(false);

    useEffect(() => {
        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                    console.log('Service Worker registered with scope:', registration.scope);
                    return registration;
                } catch (error) {
                    console.error('Service Worker registration failed:', error);
                    toast.error('Service Worker registration failed. Notifications cannot be received.');
                    return null;
                }
            } else {
                toast.error('Service Workers are not supported in this browser.');
                return null;
            }
        };

        const requestPermissionAndGetToken = async (registration) => {
            try {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    throw new Error('Permission not granted for Notifications');
                }

                const token = await getToken(messaging, {
                    vapidKey: 'BFYyEqlJZ7yE-ZxST7ORCTaLYwfDUWIg3jXWRODFHAxwF2fEUF0Kj9xfHI2iBClbe2LLw0V5H2FJ5C40vT2k5oU',
                    serviceWorkerRegistration: registration,
                });
                console.log('FCM Token:', token);
                setFcmToken(token);
            } catch (error) {
                console.error('Error getting FCM token:', error);
                toast.error('Failed to get notification permission or token: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        const initializeNotifications = async () => {
            const registration = await registerServiceWorker();
            if (registration) {
                await requestPermissionAndGetToken(registration);
            } else {
                setLoading(false);
            }
        };

        initializeNotifications();
    }, []);

    useEffect(() => {
        if (!listenerInitialized.current && fcmToken) {
            listenerInitialized.current = true;
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Message received: ', payload);
                const { title, body } = payload.notification;
                toast.info(`${title}: ${body}`);
            });
            return () => unsubscribe();
        }
    }, [fcmToken]);

    const sendNotification = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://backend-pwa-ckb5.onrender.com/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fcmToken,
                    title: 'Test Notification',
                    body: 'This is a notification test',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send notification');
            }
            console.log('Notification sent successfully');
            toast.success('Notification sent successfully!');
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error('Failed to send notification: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>React Push Notifications</h1>
            {loading ? (
                <p>Loading...</p>
            ) : fcmToken ? (
                <div>
                    <p>Your device is ready to receive notifications.</p>
                    <button onClick={sendNotification} disabled={loading}>
                        Send Test Notification
                    </button>
                </div>
            ) : (
                <p>Please allow notifications in your browser.</p>
            )}

            <ToastContainer 
                position="top-right" 
                autoClose={5000} 
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
            />
        </div>
    );
}

export default App;
