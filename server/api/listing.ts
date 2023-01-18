import type { Listings } from '../../entities/listings'
import { useFirebase } from '../../composables/useFirebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

class ListingService {
  async get(): Promise<string> {
    const { db } = await useFirebase();
    const docReference = doc(db, 'listings', 'default')
    const docSnapshot = await getDoc(docReference)

    if (!docSnapshot.exists()) {
      throw new Error(`Listing was not found!`);
    }

    return docSnapshot.data().text
  }

  async set(listing: Listings, merge:boolean = false): Promise<Listings> {
    const { db } = await useFirebase();
    const docReference = doc(db, 'listings', 'default');

    await setDoc(docReference, listing, { merge });

    return { ...listing };
  }
}

export const Listing = new ListingService();
