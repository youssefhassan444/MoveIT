/*
FIRESTORE SCHEMA DEFINITION

users/{uid}:
  - role: String ('customer' | 'driver')
  - displayName: String
  - email: String
  - photoUrl: String?
  - createdAt: Timestamp
  - fcmToken: String?
  - vehicleType: String? (drivers only: 'motorcycle' | 'sedan' | 'pickup' | 'van' | 'truck')
  - totalEarningsPiastres: int (drivers only, default 0)

jobs/{jobId}:
  - customerId: String
  - driverId: String? (nullable)
  - status: String ('pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled')
  - pickupLatLng: GeoPoint
  - dropoffLatLng: GeoPoint
  - pickupAddress: String
  - dropoffAddress: String
  - itemDescription: String
  - itemPhotoUrl: String?
  - vehicleTypeRequired: String
  - pricePiastres: int
  - createdAt: Timestamp
  - acceptedAt: Timestamp?
  - deliveredAt: Timestamp?

tracking/{jobId}:
  - driverLatLng: GeoPoint
  - updatedAt: Timestamp
  - heading: double
*/

/*
FIRESTORE SECURITY RULES

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile rules
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Job rules
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.role == 'customer';
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.customerId ||
        request.auth.uid == resource.data.driverId ||
        (resource.data.status == 'pending' && request.resource.data.status == 'accepted')
      );
      allow delete: if false;
    }
    
    // Tracking rules
    match /tracking/{jobId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/jobs/$(jobId)).data.driverId == request.auth.uid;
    }
  }
}
*/
