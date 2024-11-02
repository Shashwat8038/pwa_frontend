import React, { useEffect, useState, useRef } from 'react';
import { messaging, getToken, onMessage } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
    const [fcmToken, setFcmToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const listenerRef = useRef(false);

    useEffect(() => {
        const registerServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                    console.log('Service Worker registered with scope:', registration.scope);
                    return true;
                } catch (error) {
                    console.error('Service Worker registration failed:', error);
                    return false;
                }
            }
            return false;
        };

        const requestPermissionAndGetToken = async () => {
            if (Notification.permission !== 'granted') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    throw new Error('Permission not granted for Notifications');
                }
            }

            const token = await getToken(messaging, {
                vapidKey: 'BFYyEqlJZ7yE-ZxST7ORCTaLYwfDUWIg3jXWRODFHAxwF2fEUF0Kj9xfHI2iBClbe2LLw0V5H2FJ5C40vT2k5oU' 
            });
            console.log('FCM Token:', token);
            setFcmToken(token);
        };

        const init = async () => {
            const serviceWorkerRegistered = await registerServiceWorker();
            if (serviceWorkerRegistered) {
                await requestPermissionAndGetToken();
            } else {
                setLoading(false);
                toast.error('Service Worker registration failed. Notifications cannot be received.');
            }
        };

        init();
    }, []);

    useEffect(() => {
        if (!listenerRef.current && fcmToken) {
            listenerRef.current = true; 
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Message received: ', payload);
                const { title, body } = payload.notification;

                toast.dismiss(); 
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
            toast.dismiss(); 
            toast.success('Notification sent successfully!');
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.dismiss(); 
            toast.error('Failed to send notification: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>React Push Notifications</h1>
            {loading && <p>Loading...</p>}
            {fcmToken ? (
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
