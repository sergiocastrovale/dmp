import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';

export const firebase = async () => {
  const firebaseApp = initializeApp({
    credential: cert('./service-account.json'),
  });
  const db = getFirestore(firebaseApp);

  return {
    firebaseApp,
    db,
  };
};
