import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:latlong2/latlong.dart';

/// Data model representing a delivery Job.
/// 
/// Maps directly to the 'jobs' collection in Firestore.
/// This model handles the conversion between Firestore's [GeoPoint] 
/// and the mapping library's [LatLng].
class JobModel {
  final String id;
  final String customerId;
  final String? driverId;
  
  /// Status of the job: 
  /// - 'pending': Waiting for a driver
  /// - 'accepted': Driver assigned but not yet at pickup
  /// - 'in_transit': Items collected and on the way to dropoff
  /// - 'delivered': Job successfully completed
  /// - 'cancelled': Job was aborted
  final String status; 
  
  // Locations stored as GeoPoints for Firestore compatibility
  final GeoPoint pickupLatLng;
  final GeoPoint dropoffLatLng;
  
  final String pickupAddress;
  final String dropoffAddress;
  final String itemDescription;
  final String? itemPhotoUrl;
  final String vehicleTypeRequired;
  
  /// Cost of the delivery in Piastres (e.g., 5000 = 50.00 EGP)
  final int pricePiastres;

  /// The company's 3% cut
  final int commissionPiastres;

  /// What the driver actually receives
  final int netEarningsPiastres;

  // Timestamps
  final DateTime createdAt;
  final DateTime? acceptedAt;
  final DateTime? deliveredAt;

  const JobModel({
    required this.id,
    required this.customerId,
    this.driverId,
    required this.status,
    required this.pickupLatLng,
    required this.dropoffLatLng,
    required this.pickupAddress,
    required this.dropoffAddress,
    required this.itemDescription,
    this.itemPhotoUrl,
    required this.vehicleTypeRequired,
    required this.pricePiastres,
    required this.commissionPiastres,
    required this.netEarningsPiastres,
    required this.createdAt,
    this.acceptedAt,
    this.deliveredAt,
  });

  /// Convert GeoPoints to [LatLng] for use with flutter_map.
  LatLng get pickupLatLng2 =>
      LatLng(pickupLatLng.latitude, pickupLatLng.longitude);

  LatLng get dropoffLatLng2 =>
      LatLng(dropoffLatLng.latitude, dropoffLatLng.longitude);

  /// Creates a [JobModel] from a Firestore [DocumentSnapshot].
  factory JobModel.fromFirestore(DocumentSnapshot doc) {
    final d = doc.data() as Map<String, dynamic>;
    return JobModel(
      id: doc.id,
      customerId: d['customerId'] as String,
      driverId: d['driverId'] as String?,
      status: d['status'] as String? ?? 'pending',
      pickupLatLng: d['pickupLatLng'] as GeoPoint,
      dropoffLatLng: d['dropoffLatLng'] as GeoPoint,
      pickupAddress: d['pickupAddress'] as String? ?? '',
      dropoffAddress: d['dropoffAddress'] as String? ?? '',
      itemDescription: d['itemDescription'] as String? ?? '',
      itemPhotoUrl: d['itemPhotoUrl'] as String?,
      vehicleTypeRequired: d['vehicleTypeRequired'] as String? ?? 'motorcycle',
      pricePiastres: d['pricePiastres'] as int? ?? 0,
      commissionPiastres: d['commissionPiastres'] as int? ?? 0,
      netEarningsPiastres: d['netEarningsPiastres'] as int? ?? 0,
      createdAt: (d['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      acceptedAt: (d['acceptedAt'] as Timestamp?)?.toDate(),
      deliveredAt: (d['deliveredAt'] as Timestamp?)?.toDate(),
    );
  }

  /// Converts the model to a Map for saving to Firestore.
  Map<String, dynamic> toFirestore() => {
        'customerId': customerId,
        if (driverId != null) 'driverId': driverId,
        'status': status,
        'pickupLatLng': pickupLatLng,
        'dropoffLatLng': dropoffLatLng,
        'pickupAddress': pickupAddress,
        'dropoffAddress': dropoffAddress,
        'itemDescription': itemDescription,
        if (itemPhotoUrl != null) 'itemPhotoUrl': itemPhotoUrl,
        'vehicleTypeRequired': vehicleTypeRequired,
        'pricePiastres': pricePiastres,
        'commissionPiastres': commissionPiastres,
        'netEarningsPiastres': netEarningsPiastres,
        'createdAt': FieldValue.serverTimestamp(),
        if (acceptedAt != null) 'acceptedAt': Timestamp.fromDate(acceptedAt!),
        if (deliveredAt != null)
          'deliveredAt': Timestamp.fromDate(deliveredAt!),
      };

  /// Creates a modified copy of the job.
  JobModel copyWith({
    String? driverId,
    String? status,
    DateTime? acceptedAt,
    DateTime? deliveredAt,
  }) =>
      JobModel(
        id: id,
        customerId: customerId,
        driverId: driverId ?? this.driverId,
        status: status ?? this.status,
        pickupLatLng: pickupLatLng,
        dropoffLatLng: dropoffLatLng,
        pickupAddress: pickupAddress,
        dropoffAddress: dropoffAddress,
        itemDescription: itemDescription,
        itemPhotoUrl: itemPhotoUrl,
        vehicleTypeRequired: vehicleTypeRequired,
        pricePiastres: pricePiastres,
        commissionPiastres: commissionPiastres,
        netEarningsPiastres: netEarningsPiastres,
        createdAt: createdAt,
        acceptedAt: acceptedAt ?? this.acceptedAt,
        deliveredAt: deliveredAt ?? this.deliveredAt,
      );
}
