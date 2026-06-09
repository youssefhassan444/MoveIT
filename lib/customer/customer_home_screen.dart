import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import '../core/widgets/location_address_banner.dart';
import '../core/theme/app_theme.dart';
import '../services/auth_service.dart';
import '../services/job_service.dart';

/// =======================
/// HOME PAGE
/// =======================
class HomePage extends ConsumerStatefulWidget {
  static const routeName = 'homepage';

  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  int currentIndex = 0;

  final List<Widget> pages = const [
    HomeScreenContent(),
    DealsPage(),
    OrdersPage(),
    ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    final userAsync = ref.watch(currentUserDocProvider);
    final userName = userAsync.asData?.value?.displayName ?? 'Loading...';
    return Scaffold(
      backgroundColor: Colors.grey[100],

      /// ================= APP BAR =================
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppTheme.brandNavy,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            RichText(
              text: const TextSpan(
                children: [
                  TextSpan(
                    text: 'M',
                    style: TextStyle(
                      color: Color(0xFF1265B3),
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextSpan(
                    text: 'ove',
                    style: TextStyle(
                      color: Colors.lightBlueAccent,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextSpan(
                    text: 'It',
                    style: TextStyle(
                      color: Colors.yellow,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          const SizedBox(width: 8),
          Builder(
            builder: (context) => IconButton(
              icon: const Icon(
                Icons.menu,
                color: Colors.yellow,
                size: 34,
              ),
              onPressed: () {
                Scaffold.of(context).openEndDrawer();
              },
            ),
          ),
        ],
      ),

      /// ================= DRAWER =================
      endDrawer: Drawer(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.only(top: 60, bottom: 25),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.brandNavy,
                    Color(0xFF073867),
                  ],
                ),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 45,
                    backgroundColor: Colors.white,
                    child: Icon(
                      Icons.person,
                      size: 45,
                      color: Colors.grey.shade700,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    userName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      5,
                          (index) => const Icon(
                        Icons.star,
                        color: Colors.yellow,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            /// Drawer Items
            Expanded(
              child: ListView(
                children: [
                  _drawerItem(
                    icon: Icons.home,
                    title: 'Home Page',
                    onTap: () => Navigator.pop(context),
                  ),
                  _drawerItem(
                    icon: Icons.history,
                    title: 'Request History',
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming soon')));
                    },
                  ),
                  _drawerItem(
                    icon: Icons.notifications,
                    title: 'Notifications',
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming soon')));
                    },
                  ),
                  _drawerItem(
                    icon: Icons.settings,
                    title: 'Settings',
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming soon')));
                    },
                  ),
                  _drawerItem(
                    icon: Icons.security,
                    title: 'Safety',
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming soon')));
                    },
                  ),
                  _drawerItem(
                    icon: Icons.help_outline,
                    title: 'Help',
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Coming soon')));
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),

      body: pages[currentIndex],

      /// ================= BOTTOM NAV =================
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppTheme.brandOrange,
        unselectedItemColor: Colors.grey,
        backgroundColor: Colors.white,
        elevation: 10,
        onTap: (index) {
          setState(() {
            currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.local_offer),
            label: 'Deals',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.event_note),
            label: 'Orders',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _drawerItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.brandNavy),
      title: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.w600),
      ),
      onTap: onTap,
    );
  }
}

/// =======================
/// HOME CONTENT
/// =======================
class HomeScreenContent extends StatefulWidget {
  const HomeScreenContent({super.key});

  @override
  State<HomeScreenContent> createState() => _HomeScreenContentState();
}

class _HomeScreenContentState extends State<HomeScreenContent> {
  bool isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const LocationAddressBanner(),

            /// ================= VEHICLE SECTION =================
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
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
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(14),
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
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    subtitle: const Text(
                      'Select your preferred delivery vehicle.',
                    ),
                    trailing: AnimatedRotation(
                      turns: isExpanded ? 0.5 : 0,
                      duration: const Duration(milliseconds: 300),
                      child: const Icon(Icons.keyboard_arrow_down),
                    ),
                    onTap: () {
                      setState(() {
                        isExpanded = !isExpanded;
                      });
                    },
                  ),

                  if (isExpanded)
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        children: [
                          buildVehicleBox(
                            context: context,
                            image: 'assets/moveit_master/nos.jpeg',
                            label: 'Truck',
                            vehicleTypeId: 'truck',
                          ),
                          buildVehicleBox(
                            context: context,
                            image: 'assets/moveit_master/suz.jpeg',
                            label: 'Mini-Truck',
                            vehicleTypeId: 'mini_truck',
                          ),
                          buildVehicleBox(
                            context: context,
                            image: 'assets/moveit_master/big.jpeg',
                            label: 'Refrigerated Truck',
                            vehicleTypeId: 'refrigerated_truck',
                          ),
                          buildVehicleBox(
                            context: context,
                            image: 'assets/moveit_master/heavy.jpeg',
                            label: 'Heavy Truck',
                            vehicleTypeId: 'heavy_truck',
                          ),
                          buildVehicleBox(
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

            /// ================= WALLET SECTION =================
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(22),
                gradient: const LinearGradient(
                  colors: [
                    AppTheme.brandNavy,
                    Color(0xFF073867),
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  const Row(
                    children: [
                      Text(
                        'payit',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                        ),
                      ),
                      SizedBox(width: 8),
                      Icon(
                        Icons.account_balance_wallet,
                        color: Colors.amber,
                      ),
                    ],
                  ),

                  const SizedBox(height: 14),

                  const Text(
                    'EGP 0.00',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 24),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      buildCircleButton(
                        icon: Icons.flash_on,
                        label: 'Pay',
                      ),
                      buildCircleButton(
                        icon: Icons.add_card,
                        label: 'Wallet',
                      ),
                      buildCircleButton(
                        icon: Icons.search,
                        label: 'Explore',
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            /// ================= BANNER SECTION =================
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF0EC8EE),
                    Color(0xFF0A3EC6),
                  ],
                ),
              ),
              child: Stack(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [

                      const Text(
                        'TruckSend Logistics',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 21,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      const SizedBox(height: 12),

                      const Text(
                        'Activate the app and ship your goods with ease. Book your truck anytime.',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          height: 1.5,
                        ),
                      ),

                      const SizedBox(height: 14),

                      RichText(
                        text: const TextSpan(
                          children: [
                            TextSpan(
                              text: 'Delivery starts from ',
                              style: TextStyle(
                                color: Colors.yellowAccent,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            TextSpan(
                              text: '40 EGP',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            TextSpan(
                              text: '/km',
                              style: TextStyle(
                                color: Colors.yellowAccent,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 12),

                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: Colors.white70),
                        ),
                        child: const Text(
                          'LIMITED CAPACITY',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        ),
                      ),

                      const SizedBox(height: 18),
                    ],
                  ),

                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: ElevatedButton(
                      onPressed: () {
                        context.push('/customer/post-job');
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Click here',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 25),

            const Text(
              'Discover all shipping options on MoveIt',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),

      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.brandOrange,
        onPressed: () {
          context.push('/customer/post-job');
        },
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          'Post Delivery',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  /// ================= VEHICLE BOX =================
  Widget buildVehicleBox({
    required BuildContext context,
    required String image,
    required String label,
    required String vehicleTypeId,
  }) {
    return InkWell(
      onTap: () {
        context.push('/customer/post-job', extra: vehicleTypeId);
      },
      child: Container(
        width: double.infinity,
        height: 82,
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.symmetric(horizontal: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.black12),
          boxShadow: [
                BoxShadow(
              color: Colors.black.withAlpha((0.03 * 255).round()),
              blurRadius: 5,
            ),
          ],
        ),
        child: Row(
          children: [

            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.asset(
                image,
                width: 85,
                height: 55,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) {
                  return const Icon(
                    Icons.image_not_supported,
                    size: 40,
                  );
                },
              ),
            ),

            const SizedBox(width: 18),

            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 17,
                ),
              ),
            ),

            const Icon(
              Icons.chevron_right,
              color: Colors.grey,
            ),
          ],
        ),
      ),
    );
  }

  /// ================= CIRCLE BUTTON =================
  Widget buildCircleButton({
    required IconData icon,
    required String label,
  }) {
    return Column(
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            color: AppTheme.brandNavy,
            size: 28,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

/// =======================
/// OTHER PAGES
/// =======================
class DealsPage extends StatelessWidget {
  const DealsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text(
          'Deals Page',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}

class OrdersPage extends HookConsumerWidget {
  const OrdersPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyAsync = ref.watch(customerHistoryProvider);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('Order History', style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: historyAsync.when(
        data: (jobs) {
          if (jobs.isEmpty) {
            return const Center(child: Text('No past orders found.'));
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: jobs.length,
            itemBuilder: (context, index) {
              final job = jobs[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: ListTile(
                  title: Text(job.itemDescription, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('${DateFormat('MMM d, yyyy - h:mm a').format(job.createdAt)}\nStatus: ${job.status}'),
                  isThreeLine: true,
                  trailing: Text('${job.pricePiastres / 100} EGP', style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.brandNavy)),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
}

class ProfilePage extends HookConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserDocProvider);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text('My Profile', style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: userAsync.when(
        data: (user) {
          if (user == null) return const Center(child: Text('Not logged in'));
          return Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Center(
                  child: CircleAvatar(
                    radius: 50,
                    backgroundColor: AppTheme.brandSkyBlue,
                    child: Icon(Icons.person, size: 50, color: Colors.white),
                  ),
                ),
                const SizedBox(height: 32),
                const Text('Name', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(user.displayName, style: const TextStyle(fontSize: 18)),
                const Divider(height: 32),
                const Text('Email', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(user.email, style: const TextStyle(fontSize: 18)),
                const Divider(height: 32),
                const Text('Role', style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(user.role.toUpperCase(), style: const TextStyle(fontSize: 18)),
                const Spacer(),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () async {
                      await ref.read(authServiceProvider).signOut();
                      if (context.mounted) context.go('/auth');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red[50],
                      foregroundColor: Colors.red,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Log Out'),
                  ),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
}