// ignore_for_file: use_build_context_synchronously
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:latlong2/latlong.dart';
import 'package:go_router/go_router.dart';
import 'package:uuid/uuid.dart';
import 'dart:async';

import '../../core/theme/app_theme.dart';
import '../../core/widgets/custom_snackbar.dart';
import '../../core/widgets/premium_map_pins.dart';
import '../../services/location_service.dart';
import '../../services/geocoding_service.dart';
import '../../services/job_service.dart';
import '../../services/auth_service.dart';
import '../../models/job_model.dart';
import '../../services/routing_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

/// A multi-step stepper UI for customers to create new delivery jobs.
/// 
/// The flow consists of 4 steps:
/// 1. Item Details (Description)
/// 2. Pickup Location (Map Picker + Search)
/// 3. Dropoff Location (Map Picker + Search)
/// 4. Review & Confirm
class PostJobScreen extends HookConsumerWidget {
  /// The initial vehicle type to select (e.g. from the home screen quick links).
  final String? initialVehicleType;

  /// Creates a [PostJobScreen].
  const PostJobScreen({super.key, this.initialVehicleType});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ── Flow Control State ───────────────────────────────────────────────────
    
    final pageController = useMemoized(() => PageController());
    final currentStep = useState(0);
    
    // ── Form Data State ──────────────────────────────────────────────────────
    
    final descriptionCtrl = useTextEditingController();
    final weightCtrl = useTextEditingController();
    final pickupLocation = useState<LatLng?>(null);
    final pickupAddress = useState('');
    final dropoffLocation = useState<LatLng?>(null);
    final dropoffAddress = useState('');
    final vehicleType = useState(initialVehicleType ?? 'motorcycle');

    const totalSteps = 4;
    final locationService = ref.read(locationServiceProvider);

    // ── Auto-fill Logic ──────────────────────────────────────────────────────
    
    useEffect(() {
      Future.microtask(() async {
        final pos = await locationService.getCurrentLocation();
        if (pos != null) {
          pickupLocation.value = LatLng(pos.latitude, pos.longitude);
          final address = await locationService.reverseGeocode(pos.latitude, pos.longitude);
          pickupAddress.value = address;
        }
      });
      return null;
    }, [],);

    // ── Dismiss Keyboard on Step Change ──────────────────────────────────────
    useEffect(() {
      FocusManager.instance.primaryFocus?.unfocus();
      return null;
    }, [currentStep.value],);

    // ── Navigation Logic ─────────────────────────────────────────────────────

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

    // ── Build UI ─────────────────────────────────────────────────────────────

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F1F91),
        foregroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: goBack,
        ),
        title: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Post a Job — Step ${currentStep.value + 1} of $totalSteps',
              style: const TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 6),
            // Progress bar at the top of the screen
            LinearProgressIndicator(
              value: (currentStep.value + 1) / totalSteps,
              backgroundColor: Colors.white24,
              valueColor: const AlwaysStoppedAnimation(Colors.white),
              minHeight: 4,
            ),
          ],
        ),
        centerTitle: true,
      ),

      body: PageView(
        controller: pageController,
        physics: const NeverScrollableScrollPhysics(), // Prevent swiping to ensure data validation
        children: [
          // Step 1: Text description of the delivery items
          _ItemDetailsStep(
            controller: descriptionCtrl,
            weightController: weightCtrl,
            selectedVehicle: vehicleType.value,
            onVehicleChanged: (v) => vehicleType.value = v,
            onNext: goNext,
          ),

          // Step 2: Pickup map picker
          _LocationPickerStep(
            title: 'Pickup Location',
            initialLocation: pickupLocation.value,
            initialAddress: pickupAddress.value,
            onConfirmed: (latlng, address) {
              pickupLocation.value = latlng;
              pickupAddress.value = address;
              goNext();
            },
          ),

          // Step 3: Dropoff map picker
          _LocationPickerStep(
            title: 'Dropoff Location',
            initialLocation: dropoffLocation.value ?? pickupLocation.value,
            initialAddress: dropoffAddress.value,
            onConfirmed: (latlng, address) {
              dropoffLocation.value = latlng;
              dropoffAddress.value = address;
              goNext();
            },
          ),

          // Step 4: Final summary and submission
          _ReviewStep(
            description: descriptionCtrl.text,
            weight: weightCtrl.text,
            pickup: pickupAddress.value,
            dropoff: dropoffAddress.value,
            pickupLatLng: pickupLocation.value,
            dropoffLatLng: dropoffLocation.value,
            vehicleType: vehicleType.value,
            onPost: (calculatedPrice, calculatedCommission, calculatedNet) async {
              final authUser = ref.read(authStateChangesProvider).value;
              if (authUser == null) return;

              final jobId = const Uuid().v4();

              final job = JobModel(
                id: jobId,
                customerId: authUser.uid,
                status: 'pending',
                pickupLatLng: GeoPoint(pickupLocation.value!.latitude, pickupLocation.value!.longitude),
                dropoffLatLng: GeoPoint(dropoffLocation.value!.latitude, dropoffLocation.value!.longitude),
                pickupAddress: pickupAddress.value,
                dropoffAddress: dropoffAddress.value,
                itemDescription: descriptionCtrl.text,
                itemWeightKg: double.tryParse(weightCtrl.text.trim()),
                vehicleTypeRequired: vehicleType.value,
                pricePiastres: calculatedPrice,
                commissionPiastres: calculatedCommission,
                netEarningsPiastres: calculatedNet,
                createdAt: DateTime.now(),
              );

              // 1. Show immediately in UI
              addOptimisticJob(job);

              try {
                // 2. Perform the actual Firestore write
                await createJob(job);
                if (context.mounted) {
                  CustomSnackBar.show(context, message: 'Job posted successfully!', type: SnackBarType.success);
                  context.go('/customer');
                }
              } catch (e) {
                // 3. Rollback if the write fails
                removeOptimisticJob(jobId);
                if (context.mounted) {
                  CustomSnackBar.show(context, message: 'Error: $e', type: SnackBarType.error);
                }
              }
            },
          ),
        ],
      ),
    );
  }
}

// ── Step 1 Sub-Widget ────────────────────────────────────────

/// Step 1: Collects item description, weight, and desired vehicle type.
class _ItemDetailsStep extends StatelessWidget {
  /// Controller for the item description input.
  final TextEditingController controller;

  /// Controller for the item weight input.
  final TextEditingController weightController;

  /// The currently selected vehicle type ID.
  final String selectedVehicle;

  /// Callback when the selected vehicle type changes.
  final ValueChanged<String> onVehicleChanged;

  /// Callback to proceed to the next step.
  final VoidCallback onNext;

  /// Creates an [_ItemDetailsStep].
  const _ItemDetailsStep({
    required this.controller,
    required this.weightController,
    required this.selectedVehicle,
    required this.onVehicleChanged,
    required this.onNext,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(24),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 10),
            const Text(
              'What are you sending?',
              style: TextStyle(color: Color(0xFF113465), fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Describe the item so drivers know what to expect.',
              style: TextStyle(color: Color(0xFF112F5A), fontSize: 14),
            ),
            const SizedBox(height: 24),
            TextField(
              controller: controller,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: 'E.g., 2 large boxes, 1 small table...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF0F1F91), width: 2),
                ),
                filled: true,
                fillColor: const Color(0xFFF9FAFB),
              ),
            ),
            
            const SizedBox(height: 24),
            
            const Text(
              'Weight',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F1F91),
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: weightController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                hintText: 'Weight of the item (in kg)',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF0F1F91), width: 2),
                ),
                filled: true,
                fillColor: const Color(0xFFF9FAFB),
                suffixText: 'kg',
              ),
            ),

            const SizedBox(height: 24),
            const Text(
              'Select Vehicle Type',
              style: TextStyle(color: Color(0xFF113465), fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _VehicleOption(
                  label: 'Motorcycle',
                  icon: Icons.two_wheeler,
                  price: '5 EGP/km',
                  isSelected: selectedVehicle == 'motorcycle',
                  onTap: () => onVehicleChanged('motorcycle'),
                ),
                const SizedBox(width: 12),
                _VehicleOption(
                  label: 'Mini-Truck',
                  icon: Icons.local_shipping_outlined,
                  price: '10 EGP/km',
                  isSelected: selectedVehicle == 'mini_truck',
                  onTap: () => onVehicleChanged('mini_truck'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _VehicleOption(
                  label: 'Truck',
                  icon: Icons.local_shipping,
                  price: '15 EGP/km',
                  isSelected: selectedVehicle == 'truck',
                  onTap: () => onVehicleChanged('truck'),
                ),
                const SizedBox(width: 12),
                _VehicleOption(
                  label: 'Heavy Truck',
                  icon: Icons.fire_truck,
                  price: '25 EGP/km',
                  isSelected: selectedVehicle == 'heavy_truck',
                  onTap: () => onVehicleChanged('heavy_truck'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _VehicleOption(
                  label: 'Refrigerated',
                  icon: Icons.ac_unit,
                  price: '30 EGP/km',
                  isSelected: selectedVehicle == 'refrigerated_truck',
                  onTap: () => onVehicleChanged('refrigerated_truck'),
                ),
                const SizedBox(width: 12),
                const Expanded(child: SizedBox()),
              ],
            ),
            const SizedBox(height: 32),
            SizedBox(
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F1F91),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  if (controller.text.trim().isEmpty) {
                    CustomSnackBar.show(context, message: 'Please describe your item.', type: SnackBarType.error);
                    return;
                  }
                  onNext();
                },
                child: const Text('Continue', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _VehicleOption extends StatelessWidget {
  final String label;
  final IconData icon;
  final String price;
  final bool isSelected;
  final VoidCallback onTap;

  const _VehicleOption({
    required this.label,
    required this.icon,
    required this.price,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF0F1F91) : Colors.grey[100],
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? const Color(0xFF0F1F91) : Colors.grey[300]!,
              width: 2,
            ),
          ),
          child: Column(
            children: [
              Icon(icon, color: isSelected ? Colors.white : Colors.grey[600], size: 32),
              const SizedBox(height: 8),
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.grey[800],
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                price,
                style: TextStyle(
                  color: isSelected ? Colors.white70 : Colors.grey[500],
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Step 2/3 Sub-Widget (Map Picker) ────────────────────────

/// A generic map picker step for choosing either pickup or dropoff locations.
class _LocationPickerStep extends HookConsumerWidget {
  /// The title displayed on the picker (e.g. "Pickup Location").
  final String title;

  /// Callback when the user confirms their selected location.
  final void Function(LatLng, String) onConfirmed;

  /// Optional initial map center coordinates.
  final LatLng? initialLocation;

  /// Optional initial resolved address string.
  final String? initialAddress;

  /// Creates a [_LocationPickerStep].
  const _LocationPickerStep({
    required this.title,
    required this.onConfirmed,
    this.initialLocation,
    this.initialAddress,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const cairo = LatLng(30.0444, 31.2357);
    final mapController = useMemoized(() => MapController());
    final center = useState(initialLocation ?? cairo);
    final address = useState(initialAddress != null && initialAddress!.isNotEmpty ? initialAddress! : 'Move the map to select a location…');
    final searchCtrl = useTextEditingController(text: initialAddress);
    final searchResults = useState<List<Map<String, dynamic>>>([]);
    final geocoding = ref.read(geocodingServiceProvider);

    // Keep references to timers to debounce searches and reverse geocoding
    final searchTimer = useRef<Timer?>(null);
    final reverseTimer = useRef<Timer?>(null);

    // Clean up timers on unmount
    useEffect(() {
      return () {
        searchTimer.value?.cancel();
        reverseTimer.value?.cancel();
      };
    }, [],);

    useEffect(() {
      if (initialLocation != null) {
        center.value = initialLocation!;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          try {
            mapController.move(initialLocation!, 15);
          } catch (e) {
            debugPrint('📍 [_LocationPickerStep] mapController.move error: $e');
          }
        });
      }
      if (initialAddress != null && initialAddress!.isNotEmpty) {
        address.value = initialAddress!;
        searchCtrl.text = initialAddress!;
      }
      return null;
    }, [initialLocation, initialAddress],);

    return Stack(
      children: [
        // Real-time Map
        FlutterMap(
          mapController: mapController,
          options: MapOptions(
            initialCenter: initialLocation ?? cairo,
            initialZoom: 14,
            minZoom: 6.0,
            maxZoom: 18.0,
            cameraConstraint: CameraConstraint.containCenter(
              bounds: LatLngBounds(
                const LatLng(21.0, 24.0),
                const LatLng(33.0, 37.0),
              ),
            ),
            onPositionChanged: (pos, hasGesture) {
              // Only update center/address when the user manually moves the pin via gesture
              if (!hasGesture) return;
              center.value = pos.center;
              
              // Set a visual placeholder to indicate geocoding is active
              address.value = 'Locating address...';

              // Cancel the previous timer and schedule a new geocoding check in 600ms
              reverseTimer.value?.cancel();
              reverseTimer.value = Timer(const Duration(milliseconds: 600), () async {
                final result = await geocoding.reverse(pos.center);
                result.when(
                  success: (addr) {
                    address.value = addr;
                  },
                  failure: (_) {},
                );
              });
            },
          ),
          children: [
            TileLayer(
              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'com.moveit.egypt',
              keepBuffer: 5,
            ),
          ],
        ),

        // Static center pin overlay
        const Center(
          child: Padding(
            padding: EdgeInsets.only(bottom: 44),
            child: Icon(Icons.location_on, size: 44, color: AppTheme.brandSkyBlue),
          ),
        ),

        // Address Search Bar
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
                    prefixIcon: const Icon(Icons.search, color: Color(0xFF0F1F91)),
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                  onChanged: (q) {
                    if (q.length < 3) {
                      searchResults.value = [];
                      return;
                    }
                    // Cancel the previous search timer and schedule a new search in 600ms
                    searchTimer.value?.cancel();
                    searchTimer.value = Timer(const Duration(milliseconds: 600), () async {
                      final result = await geocoding.search(q);
                      result.when(
                        success: (list) => searchResults.value = list,
                        failure: (_) {},
                      );
                    });
                  },
                ),
              ),

              // Search Results Dropdown
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
                        title: Text(item['display_name'] as String, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 13)),
                        onTap: () {
                          final lat = double.parse(item['lat'] as String);
                          final lon = double.parse(item['lon'] as String);
                          final pos = LatLng(lat, lon);
                          
                          center.value = pos;
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

        // Confirmation Panel at the bottom
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: Container(
            padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              boxShadow: [BoxShadow(blurRadius: 10, color: Colors.black12)],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 6),
                Text(address.value, maxLines: 2, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0F1F91),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      if (address.value == 'Move the map to select a location…' || 
                          address.value == 'Locating address...' || 
                          address.value.isEmpty) {
                        CustomSnackBar.show(
                          context,
                          message: address.value == 'Locating address...' 
                              ? 'Please wait for address lookup to complete.' 
                              : 'Please select a valid $title on the map.',
                          type: SnackBarType.error,
                        );
                        return;
                      }
                      onConfirmed(center.value, address.value);
                    },
                    child: Text('Confirm $title', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ── Step 4 Sub-Widget (Review) ─────────────────────────────

/// Step 4: Final review and confirmation of the job details before posting.
class _ReviewStep extends HookConsumerWidget {
  /// Description of the item.
  final String description;

  /// Weight of the item.
  final String weight;

  /// Pickup address string.
  final String pickup;

  /// Dropoff address string.
  final String dropoff;

  /// Pickup map coordinates.
  final LatLng? pickupLatLng;

  /// Dropoff map coordinates.
  final LatLng? dropoffLatLng;

  /// Chosen vehicle type.
  final String vehicleType;

  /// Callback invoked to post the job with calculated pricing.
  final Function(int price, int commission, int net) onPost;

  /// Creates a [_ReviewStep].
  const _ReviewStep({
    required this.description,
    required this.weight,
    required this.pickup,
    required this.dropoff,
    this.pickupLatLng,
    this.dropoffLatLng,
    required this.vehicleType,
    required this.onPost,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final routeInfo = useState<RouteInfo?>(null);
    final isLoading = useState(true);
    final mapReady = useState<bool>(false);
    final mapController = useMemoized(() => MapController());
    final sheetController = useMemoized(() => DraggableScrollableController());

    useEffect(() {
      if (pickupLatLng != null && dropoffLatLng != null) {
        fetchRouteInfo(pickupLatLng!, dropoffLatLng!).then((info) {
          routeInfo.value = info;
          isLoading.value = false;
        });
      }
      return null;
    }, [pickupLatLng, dropoffLatLng],);

    useEffect(() {
      if (!mapReady.value || pickupLatLng == null || dropoffLatLng == null) return null;

      final points = routeInfo.value?.points ?? [pickupLatLng!, dropoffLatLng!];
      final bounds = LatLngBounds.fromPoints(points);

      WidgetsBinding.instance.addPostFrameCallback((_) {
        try {
          mapController.fitCamera(
            CameraFit.bounds(
              bounds: bounds,
              padding: const EdgeInsets.only(
                top: 48,
                left: 24,
                right: 24,
                bottom: 260,
              ),
              maxZoom: 15,
            ),
          );
        } catch (_) {}
      });

      // Smoothly collapse the details sheet down once route calculations are ready
      if (routeInfo.value != null) {
        Future.delayed(const Duration(milliseconds: 1000), () {
          try {
            if (sheetController.isAttached) {
              sheetController.animateTo(
                0.22,
                duration: const Duration(milliseconds: 600),
                curve: Curves.easeInOut,
              );
            }
          } catch (_) {}
        });
      }

      return null;
    }, [mapReady.value, pickupLatLng, dropoffLatLng, routeInfo.value],);

    // Pricing calculation logic
    int calculatedPrice = 0;
    int calculatedCommission = 0;
    int calculatedNet = 0;

    if (routeInfo.value != null) {
      calculatedPrice = calculateJobPrice(routeInfo.value!.distanceMeters, vehicleType);
      calculatedCommission = (calculatedPrice * 0.03).round();
      calculatedNet = calculatedPrice - calculatedCommission;
    }

    final pickupPoint = pickupLatLng ?? const LatLng(30.0444, 31.2357);
    final dropoffPoint = dropoffLatLng ?? const LatLng(30.0444, 31.2357);
    final routePoints = routeInfo.value?.points ?? [pickupPoint, dropoffPoint];
    final routePolyline = Polyline(
      points: routePoints,
      color: const Color(0xFFFF8A3D),
      strokeWidth: 5,
      borderStrokeWidth: 2,
      borderColor: Colors.white,
      strokeCap: StrokeCap.round,
      strokeJoin: StrokeJoin.round,
    );

    return Stack(
      children: [
        // ── Map Layer in the background ─────────────────────────────────────
        FlutterMap(
          mapController: mapController,
          options: MapOptions(
            initialCenter: pickupPoint,
            initialZoom: 14,
            minZoom: 6.0,
            maxZoom: 18.0,
            cameraConstraint: CameraConstraint.containCenter(
              bounds: LatLngBounds(
                const LatLng(21.0, 24.0),
                const LatLng(33.0, 37.0),
              ),
            ),
            onMapReady: () => mapReady.value = true,
          ),
          children: [
            TileLayer(
              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'com.moveit.egypt',
              keepBuffer: 5,
            ),
            PolylineLayer(
              polylines: [routePolyline],
            ),
            MarkerLayer(
              markers: [
                Marker(
                  point: pickupPoint,
                  child: const PremiumMapPin(
                    icon: Icons.home,
                    color: AppTheme.brandSkyBlue,
                  ),
                ),
                Marker(
                  point: dropoffPoint,
                  child: const PremiumMapPin(
                    icon: Icons.flag,
                    color: AppTheme.brandOrange,
                  ),
                ),
              ],
            ),
          ],
        ),

        // ── Draggable Bottom Panel ──────────────────────────────────────────
        DraggableScrollableSheet(
          controller: sheetController,
          initialChildSize: 0.45,
          minChildSize: 0.20,
          maxChildSize: 0.85,
          builder: (context, scrollController) {
            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                boxShadow: [
                  BoxShadow(
                    blurRadius: 10,
                    color: Colors.black12,
                  ),
                ],
              ),
              child: ListView(
                controller: scrollController,
                padding: const EdgeInsets.all(24),
                children: [
                  // Grab Handle
                  Center(
                    child: Container(
                      width: 40,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(5),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Header title
                  const Text(
                    'Confirm & Post',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF172057),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Information Widget (locations, description, vehicle type)
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F1F91),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF0F1F91).withValues(alpha: 0.2),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Vehicle Type Header
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Required Vehicle',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFF8A3D).withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: const Color(0xFFFF8A3D).withValues(alpha: 0.6)),
                              ),
                              child: Text(
                                vehicleType.toUpperCase(),
                                style: const TextStyle(
                                  color: Color(0xFFFF8A3D),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Divider(color: Colors.white24),
                        const SizedBox(height: 8),

                        _ReviewRow(
                          label: 'Item Description',
                          value: description,
                          icon: Icons.inventory_2_outlined,
                        ),
                        const SizedBox(height: 4),
                        const Divider(color: Colors.white10),
                        const SizedBox(height: 4),

                        _ReviewRow(
                          label: 'Weight (Kg)',
                          value: weight.isNotEmpty ? '$weight kg' : 'Not specified',
                          icon: Icons.scale_outlined,
                        ),
                        const SizedBox(height: 4),
                        const Divider(color: Colors.white10),
                        const SizedBox(height: 4),

                        // Pickup Address Row
                        _ReviewRow(
                          label: 'Pickup Location',
                          value: pickup,
                          icon: Icons.location_on_outlined,
                        ),
                        const SizedBox(height: 4),
                        const Divider(color: Colors.white10),
                        const SizedBox(height: 4),

                        // Dropoff Address Row
                        _ReviewRow(
                          label: 'Dropoff Location',
                          value: dropoff,
                          icon: Icons.flag_outlined,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Pricing and Submission Details
                  if (isLoading.value)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 24),
                        child: CircularProgressIndicator(color: Color(0xFF0F1F91)),
                      ),
                    )
                  else ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFF8A3D).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFFF8A3D).withValues(alpha: 0.3)),
                      ),
                      child: Column(
                        children: [
                          _PriceRow(
                            label: 'Distance',
                            value: routeInfo.value?.distanceLabel ?? '0 km',
                          ),
                          const SizedBox(height: 8),
                          _PriceRow(
                            label: 'Total Cost',
                            value: '${(calculatedPrice / 100).toStringAsFixed(2)} EGP',
                            isBold: true,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Includes 3% commission (${(calculatedCommission / 100).toStringAsFixed(2)} EGP)',
                            style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFFF8A3D),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        onPressed: () => onPost(calculatedPrice, calculatedCommission, calculatedNet),
                        child: const Text(
                          'Post Job',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}

class _PriceRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isBold;

  const _PriceRow({required this.label, required this.value, this.isBold = false});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(color: Colors.grey[700], fontSize: 14)),
        Text(value, style: TextStyle(
          color: const Color(0xFF0F1F91),
          fontSize: 16,
          fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
        ),),
      ],
    );
  }
}

class _ReviewRow extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _ReviewRow({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: const Color(0xFFFF8A3D), size: 22),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(color: Colors.white70, fontWeight: FontWeight.w600, fontSize: 13)),
                const SizedBox(height: 4),
                Text(value, style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w500)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}