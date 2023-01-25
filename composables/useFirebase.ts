import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import config from '../config/firebase';

export const useFirebase = async () => {
  const firebaseApp = initializeApp(config);
  const db = getFirestore(firebaseApp);

  return {
    firebaseApp,
    db,
  };
};
