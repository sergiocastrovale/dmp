import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const useFirebase = async () => {
  const firebaseApp = initializeApp({
    apiKey: 'AIzaSyAyx2V9f8xnYq76kxfShDgrGg1odHNI_YE',
    authDomain: 'dmp2-b16d5.firebaseapp.com',
    projectId: 'dmp2-b16d5',
    storageBucket: 'dmp2-b16d5.appspot.com',
    messagingSenderId: '781434620373',
    appId: '1:781434620373:web:b73c8f18415b756030555c',
  });
  const db = getFirestore(firebaseApp);

  return {
    firebaseApp,
    db,
  };
};
