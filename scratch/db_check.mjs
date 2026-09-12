import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDMRTnpnrUSrm9E4ToQdQ5n5AXCVLoswn0",
  authDomain: "trinay-ai.firebaseapp.com",
  projectId: "trinay-ai",
  appId: "1:345006614194:web:6988eaf74a6a1763428bab"
};

const app = initializeApp(firebaseConfig);

async function check(dbId) {
    console.log(`Checking database: ${dbId}`);
    try {
        const db = getFirestore(app, dbId);
        const snap = await getDocs(collection(db, 'aiMenuItems'));
        console.log(`Found ${snap.size} items in ${dbId}`);
        snap.forEach(doc => console.log(` - ${doc.data().title}`));
    } catch (e) {
        console.error(`Error checking ${dbId}:`, e.message);
    }
}

await check('(default)');
await check('appdata');
process.exit(0);
