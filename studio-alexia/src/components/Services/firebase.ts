import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBmQ206zKQECoFl8qEOhHqYx-T2hg-kIso',
  authDomain: 'studio-alexa.firebaseapp.com',
  projectId: 'studio-alexa',
  storageBucket: 'studio-alexa.firebasestorage.app',
  messagingSenderId: '796848375112',
  appId: '1:796848375112:web:b461dde474d0c7c08b9f7d',
  measurementId: 'G-FLBHWLBZ8E',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider, signInWithPopup };
