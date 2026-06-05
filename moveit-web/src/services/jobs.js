import { db } from '../firebase.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';

export class JobsService {
  static collectionName = 'jobs';

  static async createJob(data) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Failed to create job');
    }
  }

  static async getJobById(jobId) {
    try {
      const docRef = doc(db, this.collectionName, jobId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw new Error('Failed to fetch job details');
    }
  }

  static subscribeToCustomerJobs(customerId, callback) {
    const q = query(
      collection(db, this.collectionName),
      where('customerId', '==', customerId)
    );

    return onSnapshot(q, (snapshot) => {
      const jobs = [];
      snapshot.forEach(doc => jobs.push({ id: doc.id, ...doc.data() }));
      
      // Sort in memory since Firestore requires composite index for query sorting
      jobs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      
      callback(jobs);
    }, (error) => {
      console.error('Error subscribing to jobs:', error);
    });
  }

  static subscribeToJob(jobId, callback) {
    return onSnapshot(doc(db, this.collectionName, jobId), (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      }
    });
  }

  static async cancelJob(jobId) {
    try {
      await updateDoc(doc(db, this.collectionName, jobId), {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error cancelling job:', error);
      throw new Error('Failed to cancel job');
    }
  }

  static async repostJob(jobId) {
    try {
      await updateDoc(doc(db, this.collectionName, jobId), {
        status: 'pending',
        driverId: null,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error reposting job:', error);
      throw new Error('Failed to repost job');
    }
  }

  // Admin specific methods
  static async getAllJobs(filters = {}) {
    try {
      let q = collection(db, this.collectionName);
      
      // We would ideally apply filters here, but without composite indexes
      // it's safer to fetch and filter for a prototype.
      const snapshot = await getDocs(q);
      let jobs = [];
      snapshot.forEach(doc => jobs.push({ id: doc.id, ...doc.data() }));
      
      if (filters.status && filters.status !== 'all') {
        jobs = jobs.filter(j => j.status === filters.status);
      }
      
      jobs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      
      return jobs;
    } catch (error) {
      console.error('Error fetching all jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  }
}
