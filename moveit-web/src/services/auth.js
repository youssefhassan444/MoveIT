import { auth, db } from '../firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  deleteUser as firebaseDeleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export class AuthService {
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw this.formatError(error);
    }
  }

  static async signup(name, email, password) {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create Firestore user doc
      await setDoc(doc(db, 'users', user.uid), {
        role: 'customer',
        displayName: name,
        email: email,
        createdAt: serverTimestamp(),
        totalEarningsPiastres: 0 // Required by model even for customers
      });

      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw this.formatError(error);
    }
  }

  static async logout() {
    await signOut(auth);
  }

  static async getUserDoc(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user doc:', error);
      return null;
    }
  }

  static async deleteAccount() {
    const user = auth.currentUser;
    if (user) {
      await firebaseDeleteUser(user);
      // Note: In a real app we'd also delete the Firestore doc via a Cloud Function
    }
  }

  static formatError(error) {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return new Error('Invalid email or password.');
      case 'auth/email-already-in-use':
        return new Error('An account with this email already exists.');
      case 'auth/weak-password':
        return new Error('Password should be at least 6 characters.');
      case 'auth/invalid-email':
        return new Error('Please enter a valid email address.');
      default:
        return new Error('An unexpected error occurred. Please try again.');
    }
  }
}
