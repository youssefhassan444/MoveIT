import { db } from '../firebase.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

export class ReportsService {
  static collectionName = 'reports';

  static async createReport(data) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating report:', error);
      throw new Error('Failed to submit report');
    }
  }

  static subscribeToUserReports(userId, callback) {
    const q = query(
      collection(db, this.collectionName),
      where('reporterId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const reports = [];
      snapshot.forEach(doc => reports.push({ id: doc.id, ...doc.data() }));
      
      reports.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      
      callback(reports);
    }, (error) => {
      console.error('Error subscribing to reports:', error);
    });
  }

  static async getReportById(reportId) {
    try {
      const docRef = doc(db, this.collectionName, reportId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw new Error('Failed to fetch report details');
    }
  }

  // Admin specific methods
  static subscribeToAllReports(callback) {
    const q = collection(db, this.collectionName);

    return onSnapshot(q, (snapshot) => {
      const reports = [];
      snapshot.forEach(doc => reports.push({ id: doc.id, ...doc.data() }));
      
      reports.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      
      callback(reports);
    }, (error) => {
      console.error('Error subscribing to all reports:', error);
    });
  }

  static async updateReportStatus(reportId, status, adminNotes = null, adminId = null, adminName = null) {
    try {
      const updates = {
        status,
        updatedAt: serverTimestamp()
      };

      if (adminNotes !== null) updates.adminResponse = adminNotes;
      if (adminId) updates.adminId = adminId;
      if (adminName) updates.adminName = adminName;

      if (status === 'resolved' || status === 'dismissed') {
        updates.resolvedAt = serverTimestamp();
      }

      await updateDoc(doc(db, this.collectionName, reportId), updates);
    } catch (error) {
      console.error('Error updating report status:', error);
      throw new Error('Failed to update report');
    }
  }
}
