import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDMRTnpnrUSrm9E4ToQdQ5n5AXCVLoswn0",
  authDomain: "trinay-ai.firebaseapp.com",
  projectId: "trinay-ai",
  appId: "1:345006614194:web:6988eaf74a6a1763428bab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, 'appdata');

async function check() {
    console.log('Checking aiMenuItems in appdata...');
    const snap = await getDocs(collection(db, 'aiMenuItems'));
    console.log(`Found ${snap.size} total items.`);
    snap.forEach(doc => {
        const data = doc.data();
        console.log(` - ${data.title} [Visible: ${data.isVisible}, ID: ${doc.id}]`);
    });
}

await check();
process.exit(0);
