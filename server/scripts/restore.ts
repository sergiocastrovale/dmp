import { restore, initializeFirebaseApp } from 'firestore-export-import';
import serviceAccount from '../../service-account.json' assert { type: 'json' };
import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';

initializeFirebaseApp(serviceAccount);

const path = './backups/';

const getMostRecentFile = (dir: string) => {
  const orderedFiles = readdirSync(dir)
    .filter((file) => lstatSync(join(dir, file)).isFile())
    .map((name) => ({ name, mtime: lstatSync(join(dir, name)).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  return orderedFiles.length ? orderedFiles[0] : undefined;
};

try {
  const file = getMostRecentFile(path);

  if (file) {
    restore(`${path}${file.name}`)
      .then(() => {
        console.log(`Successfully restored database with ${file.name}`);
      })
      .then(() => process.exit(0));
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}
