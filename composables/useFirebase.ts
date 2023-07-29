import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const useFirebase = async () => {
  const {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  } = useRuntimeConfig();

  const firebaseApp = initializeApp({
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  });
  const db = getFirestore(firebaseApp);

  return {
    firebaseApp,
    db,
  };
};
