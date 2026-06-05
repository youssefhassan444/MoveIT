import { db } from '../firebase.js';
import { doc, onSnapshot } from 'firebase/firestore';

export class TrackingService {
  static collectionName = 'tracking';

  static watchDriverLocation(jobId, callback) {
    const docRef = doc(db, this.collectionName, jobId);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error watching tracking:', error);
    });
  }
}
