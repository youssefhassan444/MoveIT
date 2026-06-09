import 'package:flutter/material.dart';
import 'cardscreen.dart';

/// A screen that displays the user's wallet balance and payment methods.
///
/// It allows users to view their current balance in EGP, view saved cards,
/// and add new payment methods (e.g., credit/debit cards).
class WalletScreen extends StatelessWidget {
  /// The named route for this screen.
  static const String routeName = '/wallet';

  /// Creates a [WalletScreen].
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // ✅ الخلفية أبيض صريح
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F1F91),
        title: const Text(
          'Wallet',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),

      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section displaying the current wallet balance.

          Padding(
            padding: const EdgeInsets.all(20),
            child: Container(
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: const Color(0xFF0F1F91),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Balance',
                    style: TextStyle(fontSize: 16),
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        'EGP ',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '100.50',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Icon(Icons.chevron_right, color: Colors.orange),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const Divider(),

          // Section title for available payment methods.
          const Padding(
            padding: EdgeInsets.all(15),
            child: Text(
              'Payment Methods',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: Colors.black, // ✅ هنا اللون الأسود
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.orange.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.orange),
              ),
              child: const Row(
                children: [
                  Icon(Icons.money, color: Colors.orange),
                  SizedBox(width: 10),
                  Text(
                    'Cash',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 15),
          // Button to add a new card, navigating to the CardScreen.
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15),
            child: InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const CardScreen(),
                  ),
                );
              },
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F1F91),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.add_card, color: Colors.white),
                    SizedBox(width: 10),
                    Text(
                      'Add Card',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                      ),
                    ),
                    Spacer(),
                    Icon(Icons.arrow_forward_ios,
                        color: Colors.white, size: 16,),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(height: 20),

          // Section for displaying previously saved cards.
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 15),
            child: Text(
              'Saved Cards',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ),

          const SizedBox(height: 10),

          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15),
            child: Container(
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: Colors.blueGrey.shade700,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Row(
                children: [
                  Icon(Icons.credit_card, color: Colors.white),
                  SizedBox(width: 10),
                  Text(
                    '**** **** **** 1234',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}