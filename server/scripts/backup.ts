import { backup, initializeFirebaseApp  } from 'firestore-export-import';
import serviceAccount from "../../.firebase.config.json" assert { type: "json" };
import { writeFileSync } from 'fs'

initializeFirebaseApp(serviceAccount);

try {
  backup('artists').then((data: any) => {
    writeFileSync(`./backups/${new Date().valueOf()}.json`, JSON.stringify(data));
  }).then(() => process.exit(0));
} catch (e) {
  console.error(e);
  process.exit(1);
}
