import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';

import '../models/job_model.dart';
import 'auth_service.dart';

/// ─────────────────────────────────────────────────────────────
/// Optimistic Jobs
/// 
/// Provides local state management for jobs to make the UI feel
/// instantly responsive before Firestore confirms the write.
/// ─────────────────────────────────────────────────────────────

final _optimisticJobsController =
StreamController<List<JobModel>>.broadcast();

final List<JobModel> _optimisticJobs = [];

final optimisticJobsProvider = StreamProvider<List<JobModel>>((ref) {
  final stream = Stream<List<JobModel>>.multi((controller) {
    controller.add(List.unmodifiable(_optimisticJobs));

    final sub = _optimisticJobsController.stream.listen((list) {
      controller.add(list);
    });

    ref.onDispose(() => sub.cancel());
  });

  return stream;
});

void addOptimisticJob(JobModel job) {
  _optimisticJobs.insert(0, job);
  _optimisticJobsController.add(List.unmodifiable(_optimisticJobs));
}

void removeOptimisticJob(String id) {
  _optimisticJobs.removeWhere((j) => j.id == id);
  _optimisticJobsController.add(List.unmodifiable(_optimisticJobs));
}

void removeOptimisticJobsByIds(Iterable<String> ids) {
  final set = ids.toSet();
  _optimisticJobs.removeWhere((j) => set.contains(j.id));
  _optimisticJobsController.add(List.unmodifiable(_optimisticJobs));
}

/// ─────────────────────────────────────────────────────────────
/// CUSTOMER
/// ─────────────────────────────────────────────────────────────

final customerJobsProvider = StreamProvider<List<JobModel>>((ref) {
  final authState = ref.watch(authStateChangesProvider);

  return authState.when(
    data: (user) {
      if (user == null) return Stream.value([]);

      return FirebaseFirestore.instance
          .collection('jobs')
          .where('customerId', isEqualTo: user.uid)
          .snapshots()
          .map((snap) {
        final jobs = snap.docs.map(JobModel.fromFirestore).toList()
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
        return jobs;
      });
    },
    loading: () => Stream.value([]),
    error: (_, __) => Stream.value([]),
  );
});

final singleJobProvider =
StreamProvider.family<JobModel?, String>((ref, jobId) {
  return FirebaseFirestore.instance
      .collection('jobs')
      .doc(jobId)
      .snapshots()
      .map((snap) =>
  snap.exists ? JobModel.fromFirestore(snap) : null,);
});

final customerActiveJobsProvider = StreamProvider<List<JobModel>>((ref) {
  final userAsync = ref.watch(currentUserDocProvider);

  return userAsync.when(
    data: (user) {
      if (user == null) return Stream.value([]);

      return FirebaseFirestore.instance
          .collection('jobs')
          .where('customerId', isEqualTo: user.uid)
          .snapshots()
          .map((snap) {
        final jobs = snap.docs
            .map(JobModel.fromFirestore)
            .where((job) =>
            ['pending', 'accepted', 'in_transit', 'cancelled']
                .contains(job.status),)
            .toList()
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

        return jobs;
      });
    },
    loading: () => Stream.value([]),
    error: (_, __) => Stream.value([]),
  );
});

final customerHistoryProvider = StreamProvider<List<JobModel>>((ref) {
  final userAsync = ref.watch(currentUserDocProvider);

  return userAsync.when(
    data: (user) {
      if (user == null) return Stream.value([]);

      return FirebaseFirestore.instance
          .collection('jobs')
          .where('customerId', isEqualTo: user.uid)
          .snapshots()
          .map((snap) {
        final jobs = snap.docs
            .map(JobModel.fromFirestore)
            .where((job) =>
            ['delivered'].contains(job.status),)
            .toList()
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

        return jobs;
      });
    },
    loading: () => Stream.value([]),
    error: (_, __) => Stream.value([]),
  );
});

/// ─────────────────────────────────────────────────────────────
/// DRIVER
/// ─────────────────────────────────────────────────────────────

final pendingJobsProvider = StreamProvider<List<JobModel>>((ref) {
  final userAsync = ref.watch(currentUserDocProvider);

  return userAsync.when(
    data: (user) {
      if (user == null || !user.isDriver) return Stream.value([]);

      return FirebaseFirestore.instance
          .collection('jobs')
          .where('status', isEqualTo: 'pending')
          .snapshots()
          .map((snap) {
        final jobs = snap.docs
            .map(JobModel.fromFirestore)
            .where((job) =>
        job.vehicleTypeRequired == user.vehicleType,)
            .toList()
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

        return jobs;
      });
    },
    loading: () => Stream.value([]),
    error: (_, __) => Stream.value([]),
  );
});

/// ✅ IMPORTANT FIX HERE (بديل driverActiveJobsProvider)
final activeJobProvider = StreamProvider<JobModel?>((ref) {
  final authState = ref.watch(authStateChangesProvider);

  return authState.when(
    data: (user) {
      if (user == null) return Stream.value(null);

      return FirebaseFirestore.instance
          .collection('jobs')
          .where('driverId', isEqualTo: user.uid)
          .snapshots()
          .map((snap) {
        final activeJobs = snap.docs
            .map(JobModel.fromFirestore)
            .where((job) =>
            ['accepted', 'in_transit'].contains(job.status),)
            .toList();

        if (activeJobs.isEmpty) return null;

        activeJobs.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        return activeJobs.first;
      });
    },
    loading: () => Stream.value(null),
    error: (_, __) => Stream.value(null),
  );
});

final driverHistoryProvider = StreamProvider<List<JobModel>>((ref) {
  final userAsync = ref.watch(currentUserDocProvider);

  return userAsync.when(
    data: (user) {
      if (user == null) return Stream.value([]);

      return FirebaseFirestore.instance
          .collection('jobs')
          .where('driverId', isEqualTo: user.uid)
          .snapshots()
          .map((snap) {
        final jobs = snap.docs
            .map(JobModel.fromFirestore)
            .where((job) =>
            ['delivered', 'cancelled'].contains(job.status),)
            .toList()
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

        return jobs;
      });
    },
    loading: () => Stream.value([]),
    error: (_, __) => Stream.value([]),
  );
});

/// ─────────────────────────────────────────────────────────────
/// LIFECYCLE
/// 
/// Functions to mutate job state and handle business logic.
/// ─────────────────────────────────────────────────────────────

/// Driver accepts a pending job.
/// 
/// Uses a Firestore transaction to ensure the job hasn't been taken
/// by another driver concurrently.
Future<String?> acceptJob(String jobId, String driverId) async {
  final ref = FirebaseFirestore.instance.collection('jobs').doc(jobId);

  try {
    await FirebaseFirestore.instance.runTransaction((tx) async {
      final activeCheck = await FirebaseFirestore.instance
          .collection('jobs')
          .where('driverId', isEqualTo: driverId)
          .where('status', whereIn: ['accepted', 'in_transit'])
          .limit(1)
          .get();

      if (activeCheck.docs.isNotEmpty) {
        throw Exception('Driver already has active job');
      }

      final snap = await tx.get(ref);

      if (!snap.exists) {
        throw Exception('Job not found');
      }

      final data = snap.data();
      final status = data?['status'] ?? 'pending';

      if (status != 'pending') {
        throw Exception('Job already taken');
      }

      tx.update(ref, {
        'driverId': driverId,
        'status': 'accepted',
        'acceptedAt': FieldValue.serverTimestamp(),
      });
    });

    return null;
  } catch (e) {
    return e.toString();
  }
}

/// Updates the job status to 'in_transit'.
/// 
/// Can only be called by the assigned driver when the current status is 'accepted'.
Future<String?> markJobInTransit(String jobId, String driverId) async {
  final ref = FirebaseFirestore.instance.collection('jobs').doc(jobId);

  try {
    await FirebaseFirestore.instance.runTransaction((tx) async {
      final snap = await tx.get(ref);

      if (!snap.exists) throw Exception('job_not_found');

      final data = snap.data();
      if (data?['driverId'] != driverId) {
        throw Exception('unauthorized');
      }

      if (data?['status'] != 'accepted') {
        throw Exception('invalid_state');
      }

      tx.update(ref, {'status': 'in_transit'});
    });

    return null;
  } catch (e) {
    return e.toString();
  }
}

/// Marks a job as 'delivered' and updates the driver's earnings and wallet balance.
/// 
/// Calculates a 3% platform fee and deducts it from the driver's wallet.
Future<String?> markJobDelivered(String jobId, String driverId) async {
  final ref = FirebaseFirestore.instance.collection('jobs').doc(jobId);
  final driverRef = FirebaseFirestore.instance.collection('users').doc(driverId);

  try {
    await FirebaseFirestore.instance.runTransaction((tx) async {
      final snap = await tx.get(ref);

      if (!snap.exists) throw Exception('job_not_found');

      final data = snap.data();
      if (data?['driverId'] != driverId) {
        throw Exception('unauthorized');
      }

      if (data?['status'] != 'in_transit') {
        throw Exception('invalid_state');
      }

      final jobPrice = data?['pricePiastres'] as int? ?? 0;
      final platformFee = (jobPrice * 0.03).round();

      tx.update(ref, {
        'status': 'delivered',
        'deliveredAt': FieldValue.serverTimestamp(),
      });
      
      tx.update(driverRef, {
        'totalEarningsPiastres': FieldValue.increment(jobPrice),
        'walletBalancePiastres': FieldValue.increment(-platformFee),
      });
    });

    return null;
  } catch (e) {
    return e.toString();
  }
}

/// Creates a new job document in Firestore.
/// 
/// If [job.id] is provided, it uses `set` on that specific document ID.
/// Otherwise, it uses `add` to let Firestore generate an ID.
Future<void> createJob(JobModel job) async {
  final col = FirebaseFirestore.instance.collection('jobs');

  if (job.id.isNotEmpty) {
    await col.doc(job.id).set(job.toFirestore());
  } else {
    await col.add(job.toFirestore());
  }
}

/// Cancels a job from the driver's side.
/// 
/// Sets the status to 'cancelled' and records the cancellation time.
Future<String?> cancelJobByDriver(String jobId) async {
  try {
    await FirebaseFirestore.instance.collection('jobs').doc(jobId).update({
      'status': 'cancelled',
      'cancelledAt': FieldValue.serverTimestamp(),
    });
    return null;
  } catch (e) {
    return e.toString();
  }
}

/// Reposts a cancelled or rejected job.
/// 
/// Resets the status to 'pending', clears the `driverId` and `acceptedAt`, 
/// and updates the `createdAt` timestamp so it appears as a new request.
Future<String?> repostJob(String jobId) async {
  try {
    await FirebaseFirestore.instance.collection('jobs').doc(jobId).update({
      'status': 'pending',
      'driverId': FieldValue.delete(),
      'acceptedAt': FieldValue.delete(),
      'createdAt': FieldValue.serverTimestamp(),
    });
    return null;
  } catch (e) {
    return e.toString();
  }
}