// ignore_for_file: unawaited_futures
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/location_address_banner.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';

// ✅ أسماء الملفات الصحيحة عندك
import 'cardscreen.dart';
import 'walletscreen.dart';
import '../../services/location_service.dart';

/// The main home screen for a customer.
///
/// It displays the current location, options for selecting a vehicle type,
/// the user's wallet balance, and a logistics banner for quick bookings.
class CustomerHomeScreen extends ConsumerStatefulWidget {
  /// Creates a [CustomerHomeScreen].
  const CustomerHomeScreen({super.key});

  @override
  ConsumerState<CustomerHomeScreen> createState() => _CustomerHomeScreenState();
}

/// The state for [CustomerHomeScreen], handling location requests and UI state.
class _CustomerHomeScreenState extends ConsumerState<CustomerHomeScreen> {
  // Controls the expansion state of the vehicle selection list.
  bool isExpanded = false;

  @override
  void initState() {
    super.initState();
    // Request location permissions and fetch the address right after the first frame renders.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _requestLocationJIT();
    });
  }

  /// Just-In-Time (JIT) location request.
  ///
  /// Requests location permission from the user and fetches their current address.
  Future<void> _requestLocationJIT() async {
    final locService = ref.read(locationServiceProvider);
    await locService.requestPermission();
    fetchAndResolveCurrentAddress(ref);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const LocationAddressBanner(),

            // ================= VEHICLE SECTION =================
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha((0.05 * 255).round()),
                    blurRadius: 15,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                children: [

                  ListTile(
                    leading: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.local_shipping,
                        size: 32,
                        color: AppTheme.brandNavy,
                      ),
                    ),

                    title: const Text(
                      'Choose your trip',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),

                    subtitle: const Text(
                      'Select your preferred delivery vehicle.',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.black,
                      ),
                    ),

                    trailing: AnimatedRotation(
                      turns: isExpanded ? 0.5 : 0,
                      duration: const Duration(milliseconds: 300),
                      child: const Icon(
                        Icons.keyboard_arrow_down,
                        color: Colors.black,
                      ),
                    ),

                    onTap: () {
                      setState(() {
                        isExpanded = !isExpanded;
                      });
                    },
                  ),

                  if (isExpanded)
                    Padding(
                      padding: const EdgeInsets.all(10.0),
                      child: Column(
                        children: [
                          _buildVehicleBox(
                            context: context,
                            image: 'assets/moveit_master/nos.jpeg',
                            label: 'Truck',
                            vehicleTypeId: 'truck',
                          ),
                          _buildVehicleBox(
                            context: context,
                            image: 'assets/moveit_master/suz.jpeg',
                            label: 'Mini-Truck',
                            vehicleTypeId: 'mini_truck',
                          ),
                          _buildVehicleBox(
                            context: context,
                            image: 'assets/moveit_master/big.jpeg',
                            label: 'Refrigerated Truck',
                            vehicleTypeId: 'refrigerated_truck',
                          ),
                          _buildVehicleBox(
                            context: context,
                            image: 'assets/moveit_master/heavy.jpeg',
                            label: 'Heavy Truck',
                            vehicleTypeId: 'heavy_truck',
                          ),
                          _buildVehicleBox(
                            context: context,
                            image: 'assets/moveit_master/easy.jpeg',
                            label: 'Motorcycle',
                            vehicleTypeId: 'motorcycle',
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // ================= PAY WALLET =================
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(22),
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF18398F),
                    Color(0xFF142A5C),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha((0.18 * 255).round()),
                    blurRadius: 25,
                    offset: const Offset(0, 12),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  const Row(
                    children: [
                      Icon(Icons.account_balance_wallet,
                          color: Colors.amber, size: 22,),
                      SizedBox(width: 8),
                      Text(
                        'PayIt Wallet',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 18),

                  const Text(
                    'Available Balance',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                    ),
                  ),

                  const SizedBox(height: 6),

                  const Text(
                    'EGP 0.00',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 18),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [

                      _walletAction(
                        icon: Icons.add,
                        label: 'Top Up',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const CardScreen(),
                            ),
                          );
                        },
                      ),

                      _walletAction(
                        icon: Icons.wallet,
                        label: 'Wallet',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const WalletScreen(),
                            ),
                          );
                        },
                      ),

                      _walletAction(
                        icon: Icons.history,
                        label: 'History',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const WalletScreen(),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // ================= LOGISTICS BANNER =================
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF0A3EC6),
                    Color(0xFF0EC8EE),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha((0.12 * 255).round()),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  const Text(
                    'TruckSend Logistics',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 8),

                  const Text(
                    'Fast, safe and reliable delivery for your goods anywhere in the city.',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                      height: 1.4,
                    ),
                  ),

                  const SizedBox(height: 16),

                  const Text(
                    'From 40 EGP/km',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 16),

                  Align(
                    alignment: Alignment.bottomRight,
                    child: ElevatedButton(
                      onPressed: () =>
                          context.push('/customer/post-job'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: const Text('Book Now'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ================= VEHICLE BOX =================
  /// Builds a clickable container representing a vehicle type.
  ///
  /// It navigates to the post-job screen passing the [vehicleTypeId] when tapped.
  Widget _buildVehicleBox({
    required BuildContext context,
    required String image,
    required String label,
    required String vehicleTypeId,
  }) {
    return InkWell(
      // Navigate to post-job and pass the selected vehicle type.
      onTap: () => context.push('/customer/post-job', extra: vehicleTypeId),
      child: Container(
        height: 80,
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.black12),
        ),
        child: Row(
          children: [
            Image.asset(image, width: 80, height: 50),
            const SizedBox(width: 20),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.black),
          ],
        ),
      ),
    );
  }

  // ================= WALLET ACTION =================
  /// Builds an actionable button for the wallet section.
  ///
  /// The [icon] and [label] are displayed, and [onTap] is called when pressed.
  Widget _walletAction({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      // Execute the provided callback when the action is tapped.
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
                color: Colors.white.withAlpha((0.12 * 255).round()),
                shape: BoxShape.circle,
              ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}