import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCfmAn2qjdNd_iyCS4wqYniDj6m9bO5Aqc',
  authDomain: 'moveit-v2-e8079.firebaseapp.com',
  projectId: 'moveit-v2-e8079',
  storageBucket: 'moveit-v2-e8079.firebasestorage.app',
  messagingSenderId: '853397289334',
  appId: '1:853397289334:web:a7e127f9c0d67637786257',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const seedAdmins = async () => {
  console.log('Seeding 12 admin accounts...');
  
  for (let i = 1; i <= 12; i++) {
    const email = `admin${i}@moveit.com`;
    const password = 'moveitadmin';
    const name = `MoveIt Admin ${i}`;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        role: 'admin',
        adminSetupKey: 'MOVEIT_ADMIN_INIT_2026',
        displayName: name,
        email: email,
        createdAt: new Date(),
        totalEarningsPiastres: 0
      });
      
      console.log(`✅ Created ${email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            role: 'admin',
            adminSetupKey: 'MOVEIT_ADMIN_INIT_2026',
            displayName: name,
            email: email,
            createdAt: new Date(),
            totalEarningsPiastres: 0
          });
          console.log(`✅ Updated existing ${email}`);
        } catch(innerError) {
          console.error(`❌ Failed to update ${email}:`, innerError.message);
        }
      } else {
        console.error(`❌ Failed to create ${email}:`, error.message);
      }
    }
  }
  
  console.log('Done!');
  process.exit(0);
};

seedAdmins();
