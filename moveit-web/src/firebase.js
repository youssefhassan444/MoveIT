// Firebase initialization — same project as mobile app (moveit-v2-e8079)
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCfmAn2qjdNd_iyCS4wqYniDj6m9bO5Aqc',
  authDomain: 'moveit-v2-e8079.firebaseapp.com',
  projectId: 'moveit-v2-e8079',
  storageBucket: 'moveit-v2-e8079.firebasestorage.app',
  messagingSenderId: '853397289334',
  appId: '1:853397289334:web:a7e127f9c0d67637786257',
  measurementId: 'G-7J8C632N8S',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
