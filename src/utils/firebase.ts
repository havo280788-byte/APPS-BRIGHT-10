import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBcMWInwvTJVXuwkIkK5eh9l88HoyHH2ck",
    authDomain: "apps--bright-10.firebaseapp.com",
    projectId: "apps--bright-10",
    storageBucket: "apps--bright-10.firebasestorage.app",
    messagingSenderId: "949452524414",
    appId: "1:949452524414:web:b85400b95fc697fb3d012f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
