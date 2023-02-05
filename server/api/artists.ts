import type { Artist } from '../../entities/artist';
import { useFirebase } from '../../composables/useFirebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  setDoc,
  orderBy,
} from 'firebase/firestore';

class ArtistService {
  async get() {
    const { db } = await useFirebase();
    const querySnapshot = await getDocs(
      query(collection(db, 'artists'), orderBy('name')),
    );
    const Artists = querySnapshot.docs.map<Artist>((doc) => {
      const { name, musicbrainzId, localCatalogue, wikipedia, urls } =
        doc.data();

      return {
        id: doc.id,
        name,
        musicbrainzId,
        localCatalogue,
        wikipedia,
        urls,
      };
    });

    return Artists;
  }

  async find(id: string): Promise<Artist> {
    const { db } = await useFirebase();
    const docReference = doc(db, 'artists', id);
    const docSnapshot = await getDoc(docReference);

    if (!docSnapshot.exists()) {
      throw new Error(`Document with id ${id} was not found!`);
    }

    const { name, musicbrainzId, localCatalogue, wikipedia, urls } =
      docSnapshot.data();

    return {
      id: docSnapshot.id,
      name,
      musicbrainzId,
      localCatalogue,
      wikipedia,
      urls,
    };
  }

  async set(id: string, artist: Artist, merge = false): Promise<Artist> {
    const { db } = await useFirebase();
    const docReference = doc(db, 'artists', id);

    await setDoc(docReference, artist, { merge });

    return { ...artist, id };
  }

  async add(artist: Artist): Promise<Artist> {
    const { db } = await useFirebase();

    await addDoc(collection(db, 'artists'), artist);

    return { ...artist };
  }

  async delete(id: string) {
    const { db } = await useFirebase();
    const docReference = doc(db, 'artists', id);
    const docSnapshot = await getDoc(docReference);

    if (!docSnapshot.exists()) {
      throw new Error(
        `Document with id ${id} was not found so it cannot be deleted!`,
      );
    }

    await deleteDoc(docReference);
  }

  async update(id: string, artist: Artist) {
    const { db } = await useFirebase();
    const docReference = doc(db, 'artists', id);
    const docSnapshot = await getDoc(docReference);

    if (!docSnapshot.exists()) {
      throw new Error(
        `Document with id ${id} was not found so it cannot be updated!`,
      );
    }

    await updateDoc(docReference, { ...artist });
  }
}

export const Artists = new ArtistService();
