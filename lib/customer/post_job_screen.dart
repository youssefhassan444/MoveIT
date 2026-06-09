// ignore_for_file: use_build_context_synchronously
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:uuid/uuid.dart';

import '../core/theme/app_theme.dart';
import '../services/routing_service.dart';
import '../services/auth_service.dart';
import '../services/job_service.dart';
import '../models/job_model.dart';
import '../../core/widgets/custom_snackbar.dart';
import '../../services/geocoding_service.dart';
import '../../services/location_service.dart';

class PostJobScreen extends HookConsumerWidget {
  final String? initialVehicleType;
  const PostJobScreen({super.key, this.initialVehicleType});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pageController = useMemoized(() => PageController());
    final currentStep = useState(0);
    final descriptionCtrl = useTextEditingController();

    final pickupLocation = useState<LatLng?>(null);
    final pickupAddress = useState('');
    final dropoffLocation = useState<LatLng?>(null);
    final dropoffAddress = useState('');
    final vehicleType = useState(initialVehicleType ?? 'motorcycle');

    const totalSteps = 5;

    void goNext() {
      if (currentStep.value < totalSteps - 1) {
        currentStep.value++;
        pageController.nextPage(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      }
    }

    void goBack() {
      if (currentStep.value > 0) {
        currentStep.value--;
        pageController.previousPage(
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      } else {
        context.pop();
      }
    }

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
            icon: const Icon(Icons.arrow_back), onPressed: goBack,),
        title: Column(
          children: [
            Text('Post a Job — Step ${currentStep.value + 1} of $totalSteps',
                style: const TextStyle(fontSize: 14),),
            const SizedBox(height: 6),
            LinearProgressIndicator(
              value: (currentStep.value + 1) / totalSteps,
              backgroundColor: Colors.grey[200],
              valueColor:
                  const AlwaysStoppedAnimation(AppTheme.brandSkyBlue),
              minHeight: 4,
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: PageView(
        controller: pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          // Step 1 — Item Details
          _ItemDetailsStep(controller: descriptionCtrl, onNext: goNext),

          // Step 2 — Pickup
          _LocationPickerStep(
            title: 'Pickup Location',
            autoLocate: true,
            onConfirmed: (latlng, address) {
              pickupLocation.value = latlng;
              pickupAddress.value = address;
              goNext();
            },
          ),

          // Step 3 — Dropoff
          _LocationPickerStep(
            title: 'Dropoff Location',
            autoLocate: true,
            onConfirmed: (latlng, address) {
              dropoffLocation.value = latlng;
              dropoffAddress.value = address;
              goNext();
            },
          ),

          // Step 4 — Vehicle
          _VehicleTypeStep(
            selected: vehicleType.value,
            onSelected: (v) {
              vehicleType.value = v;
              goNext();
            },
          ),

          // Step 5 — Review & Post
          _ReviewStep(
            description: descriptionCtrl.text,
            pickup: pickupAddress.value,
            dropoff: dropoffAddress.value,
            vehicle: vehicleType.value,
            pickupLatLng: pickupLocation.value,
            dropoffLatLng: dropoffLocation.value,
            onPost: () {
              CustomSnackBar.show(context,
                  message: 'Job posted! Waiting for a driver…',
                  type: SnackBarType.success,);
              context.go('/customer');
            },
          ),
        ],
      ),
    );
  }
}

// ── Step 1: Item Details ──────────────────────────────────────────────────────
class _ItemDetailsStep extends StatelessWidget {
  final TextEditingController controller;
  final VoidCallback onNext;
  const _ItemDetailsStep({required this.controller, required this.onNext});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('What are you sending?',
              style: Theme.of(context).textTheme.headlineMedium,),
          const SizedBox(height: 8),
          const Text('Describe the item so drivers know what to expect.'),
          const SizedBox(height: 32),
          TextField(
            controller: controller,
            maxLines: 4,
            maxLength: 200,
            decoration: const InputDecoration(
              labelText: 'Item description',
              hintText: 'e.g. Medium box of books, fragile',
              alignLabelWithHint: true,
            ),
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: () {
              if (controller.text.trim().isEmpty) {
                CustomSnackBar.show(context,
                    message: 'Please describe your item.',
                    type: SnackBarType.error,);
                return;
              }
              onNext();
            },
            child: const Text('Continue'),
          ),
        ],
      ),
    );
  }
}

class _LocationPickerStep extends HookConsumerWidget {
  final String title;
  final bool autoLocate;
  final void Function(LatLng, String) onConfirmed;
  const _LocationPickerStep({
    required this.title,
    this.autoLocate = false,
    required this.onConfirmed,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Cairo default center
    const cairo = LatLng(30.0444, 31.2357);
    final mapController = useMemoized(() => MapController());
    final center = useState(cairo);
    final address = useState('Move the map to select a location…');
    final searchCtrl = useTextEditingController();
    final searchResults = useState<List<Map<String, dynamic>>>([]);
    final geocoding = ref.read(geocodingServiceProvider);

    useEffect(() {
      if (!autoLocate) {
        debugPrint('📍 [_LocationPickerStep:autoLocate] autoLocate disabled for this step.');
        return null;
      }

      Future<void> initLocation() async {
        debugPrint('📍 [_LocationPickerStep:autoLocate] Starting auto-locate sequence for step: $title');
        final locService = ref.read(locationServiceProvider);
        
        debugPrint('📍 [_LocationPickerStep:autoLocate] Requesting current coordinates...');
        final pos = await locService.getCurrentLocation();
        if (pos != null) {
          debugPrint('📍 [_LocationPickerStep:autoLocate] Received position: (${pos.latitude}, ${pos.longitude})');
          final latlng = LatLng(pos.latitude, pos.longitude);
          center.value = latlng;
          mapController.move(latlng, 15);
          
          address.value = 'Locating address...';
          debugPrint('📍 [_LocationPickerStep:autoLocate] Requesting reverse geocode from GeocodingService...');
          final result = await geocoding.reverse(latlng);
          result.when(
            success: (addr) {
              debugPrint('📍 [_LocationPickerStep:autoLocate] Reverse geocode succeeded: "$addr"');
              address.value = addr;
            },
            failure: (err) {
              debugPrint('📍 [_LocationPickerStep:autoLocate] Reverse geocode failed: $err. Falling back to coordinate string.');
              address.value = '${latlng.latitude.toStringAsFixed(4)}, ${latlng.longitude.toStringAsFixed(4)}';
            },
          );
        } else {
          debugPrint('📍 [_LocationPickerStep:autoLocate] Could not retrieve position (returned null). Map centering skipped.');
        }
      }

      initLocation();
      return null;
    }, [autoLocate],);

    return Stack(
      children: [
        // ── Full-screen map ──
        FlutterMap(
          mapController: mapController,
          options: MapOptions(
            initialCenter: cairo,
            initialZoom: 14,
            onPositionChanged: (pos, hasGesture) async {
              if (!hasGesture) return;
              debugPrint('📍 [_LocationPickerStep:onPositionChanged] User manually panned map to: (${pos.center.latitude}, ${pos.center.longitude})');
              center.value = pos.center;
              final result = await geocoding.reverse(pos.center);
              result.when(
                success: (addr) {
                  debugPrint('📍 [_LocationPickerStep:onPositionChanged] Reverse geocode: "$addr"');
                  address.value = addr;
                },
                failure: (err) {
                  debugPrint('📍 [_LocationPickerStep:onPositionChanged] Reverse geocode failed: $err');
                },
              );
            },
          ),
          children: [
            TileLayer(
              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'com.moveit.egypt',
            ),
          ],
        ),

        // ── Crosshair ──
        const Center(
          child: Padding(
            padding: EdgeInsets.only(bottom: 44),
            child: Icon(Icons.location_on,
                size: 44, color: AppTheme.brandSkyBlue,),
          ),
        ),

        // ── Search bar ──
        Positioned(
          top: 12,
          left: 12,
          right: 12,
          child: Column(
            children: [
              Material(
                elevation: 4,
                borderRadius: BorderRadius.circular(12),
                child: TextField(
                  controller: searchCtrl,
                  decoration: InputDecoration(
                    hintText: 'Search address…',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: searchCtrl.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              searchCtrl.clear();
                              searchResults.value = [];
                            },)
                        : null,
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,),
                    filled: true,
                    fillColor: Colors.white,
                  ),
                  onChanged: (q) async {
                    if (q.length < 3) {
                      searchResults.value = [];
                      return;
                    }
                    final result = await geocoding.search(q);
                    result.when(
                      success: (list) => searchResults.value = list,
                      failure: (_) {},
                    );
                  },
                ),
              ),
              if (searchResults.value.isNotEmpty)
                Material(
                  elevation: 4,
                  borderRadius: BorderRadius.circular(12),
                  child: ListView.builder(
                    shrinkWrap: true,
                    itemCount: searchResults.value.length,
                    itemBuilder: (_, i) {
                      final item = searchResults.value[i];
                      return ListTile(
                        title: Text(item['display_name'] as String,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 13),),
                        onTap: () {
                          final lat = double.parse(item['lat'] as String);
                          final lon = double.parse(item['lon'] as String);
                          final pos = LatLng(lat, lon);
                          mapController.move(pos, 15);
                          address.value = item['display_name'] as String;
                          searchCtrl.text = item['display_name'] as String;
                          searchResults.value = [];
                        },
                      );
                    },
                  ),
                ),
            ],
          ),
        ),

        // ── Confirm panel ──
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: Container(
            padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius:
                  BorderRadius.vertical(top: Radius.circular(24)),
              boxShadow: [BoxShadow(blurRadius: 10, color: Colors.black12)],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(title,
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 16,),),
                const SizedBox(height: 6),
                Text(address.value,
                    maxLines: 2,
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey[600], fontSize: 12),),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () => onConfirmed(center.value, address.value),
                  child: Text('Confirm $title'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ── Step 4: Vehicle Type ──────────────────────────────────────────────────────
class _VehicleTypeStep extends StatelessWidget {
  final String selected;
  final void Function(String) onSelected;
  const _VehicleTypeStep(
      {required this.selected, required this.onSelected,});

  static const _vehicles = [
    ('motorcycle', '🏍️', 'Motorcycle'),
    ('mini_truck', '🚚', 'Mini-Truck'),
    ('truck', '🛻', 'Truck'),
    ('heavy_truck', '🚛', 'Heavy Truck'),
    ('refrigerated_truck', '❄️', 'Refrigerated Truck'),
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Choose a Vehicle',
              style: Theme.of(context).textTheme.headlineMedium,),
          const SizedBox(height: 24),
          ..._vehicles.map((v) {
            final (id, emoji, label) = v;
            final active = selected == id;
            return GestureDetector(
              onTap: () => onSelected(id),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: Border.all(
                      color: active
                          ? AppTheme.brandSkyBlue
                          : Colors.grey[300]!,
                      width: 2,),
                  borderRadius: BorderRadius.circular(12),
                    color: active
                      ? AppTheme.brandSkyBlue.withAlpha((0.06 * 255).round())
                      : Colors.transparent,
                ),
                child: Row(
                  children: [
                    Text(emoji, style: const TextStyle(fontSize: 24)),
                    const SizedBox(width: 16),
                    Text(label,
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 16,),),
                    const Spacer(),
                    if (active)
                      const Icon(Icons.check_circle,
                          color: AppTheme.brandSkyBlue,),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}

// ── Step 5: Review & Post ─────────────────────────────────────────────────────
class _ReviewStep extends HookConsumerWidget {
  final String description, pickup, dropoff, vehicle;
  final LatLng? pickupLatLng, dropoffLatLng;
  final VoidCallback onPost;

  const _ReviewStep({
    required this.description,
    required this.pickup,
    required this.dropoff,
    required this.vehicle,
    required this.pickupLatLng,
    required this.dropoffLatLng,
    required this.onPost,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final routeInfo = useState<RouteInfo?>(null);
    final isCalculating = useState(true);
    final error = useState<String?>(null);
    final mapController = useMemoized(() => MapController());
    final isPosting = useState(false);

    useEffect(() {
      if (pickupLatLng == null || dropoffLatLng == null) {
        error.value = 'Invalid locations.';
        isCalculating.value = false;
        return null;
      }
      
      fetchRouteInfo(pickupLatLng!, dropoffLatLng!).then((info) {
        routeInfo.value = info;
        isCalculating.value = false;
        
        WidgetsBinding.instance.addPostFrameCallback((_) {
          try {
            final bounds = LatLngBounds.fromPoints(info.points);
            final center = LatLng(
              (bounds.north + bounds.south) / 2,
              (bounds.west + bounds.east) / 2,
            );
            mapController.move(center, 12);
          } catch (_) {}
        });
      }).catchError((err) {
        error.value = 'Could not calculate route: $err';
        isCalculating.value = false;
      });

      return null;
    }, [pickupLatLng, dropoffLatLng],);

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Review & Quote',
              style: Theme.of(context).textTheme.headlineMedium,),
          const SizedBox(height: 16),
          
          if (isCalculating.value)
            const Expanded(child: Center(child: CircularProgressIndicator()))
          else if (error.value != null)
            Expanded(child: Center(child: Text(error.value!, style: const TextStyle(color: Colors.red))))
          else ...[
            // MAP PREVIEW
            Container(
              height: 200,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10)],
              ),
              clipBehavior: Clip.hardEdge,
              child: FlutterMap(
                mapController: mapController,
                options: const MapOptions(
                  initialZoom: 12,
                ),
                children: [
                  TileLayer(
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.moveit.egypt',
                  ),
                  if (routeInfo.value != null)
                    PolylineLayer(
                      polylines: [
                        Polyline(
                          points: routeInfo.value!.points,
                          color: AppTheme.brandSkyBlue,
                          strokeWidth: 4,
                        ),
                      ],
                    ),
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: pickupLatLng!,
                        child: const Icon(Icons.location_on, color: AppTheme.brandSkyBlue, size: 30),
                      ),
                      Marker(
                        point: dropoffLatLng!,
                        child: const Icon(Icons.flag, color: AppTheme.brandOrange, size: 30),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            Expanded(
              child: SingleChildScrollView(
                child: Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _Row('Item', description),
                        _Row('Pickup', pickup),
                        _Row('Dropoff', dropoff),
                        _Row('Vehicle', vehicle.toUpperCase()),
                        const Divider(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Distance', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                            Text(routeInfo.value!.distanceLabel, style: const TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Estimated Time', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                            Text(routeInfo.value!.durationLabel, style: const TextStyle(fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.brandOrange.withAlpha((0.1 * 255).round()),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Total Price', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                              Text(
                                '${(calculateJobPrice(routeInfo.value!.distanceMeters, vehicle) / 100).toStringAsFixed(0)} EGP',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 22, color: AppTheme.brandOrange),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
          
          const SizedBox(height: 16),
          
          ElevatedButton(
            onPressed: (isCalculating.value || error.value != null || isPosting.value) ? null : () async {
              isPosting.value = true;

              final user = ref.read(firebaseAuthProvider).currentUser;
              if (user == null) {
                CustomSnackBar.show(context, message: 'You must be logged in.', type: SnackBarType.error);
                isPosting.value = false;
                return;
              }

              final price = calculateJobPrice(routeInfo.value!.distanceMeters, vehicle);
              final commission = (price * 0.03).round();
              final netEarnings = price - commission;
              
              final newJob = JobModel(
                id: const Uuid().v4(),
                customerId: user.uid,
                itemDescription: description,
                pickupAddress: pickup,
                dropoffAddress: dropoff,
                pickupLatLng: GeoPoint(pickupLatLng!.latitude, pickupLatLng!.longitude),
                dropoffLatLng: GeoPoint(dropoffLatLng!.latitude, dropoffLatLng!.longitude),
                vehicleTypeRequired: vehicle,
                pricePiastres: price,
                commissionPiastres: commission,
                netEarningsPiastres: netEarnings,
                status: 'pending',
                createdAt: DateTime.now(),
              );

              try {
                await createJob(newJob);
                onPost();
              } catch (e) {
                CustomSnackBar.show(context, message: 'Failed to post job: $e', type: SnackBarType.error);
              } finally {
                if (context.mounted) {
                  isPosting.value = false;
                }
              }
            },
            child: isPosting.value 
              ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) 
              : const Text('Post Job'),
          ),
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label, value;
  const _Row(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
              width: 72,
              child: Text(label,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppTheme.brandNavy,),),),
          Expanded(
              child: Text(value,
                  style: TextStyle(color: Colors.grey[700]),),),
        ],
      ),
    );
  }
}
