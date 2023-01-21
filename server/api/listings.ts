import type { Listing } from '../../entities/listing'
import { useFirebase } from '../../composables/useFirebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

class ListingService {
  async get(): Promise<Listing> {
    const { db } = await useFirebase();
    const docReference = doc(db, 'listings', 'default')
    const docSnapshot = await getDoc(docReference)

    if (!docSnapshot.exists()) {
      throw new Error(`Listing was not found!`);
    }

    const { catalogue, lastUpdate, directoriesCount, artistsCount } = docSnapshot.data();

    return { catalogue, lastUpdate, directoriesCount, artistsCount };
  }

  async set(listing: Listing): Promise<Listing> {
    const { db } = await useFirebase();
    const docReference = doc(db, 'listings', 'default');

    await setDoc(docReference, listing, { merge: false });

    return { ...listing };
  }
}

export const Listings = new ListingService();
