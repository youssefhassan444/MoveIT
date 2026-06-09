import 'package:flutter/material.dart';
import 'walletscreen.dart';

/// A screen that allows users to add a new credit or debit card.
///
/// It collects the card number, expiry date, and CVV, and validates
/// that all fields are filled before proceeding.
class CardScreen extends StatefulWidget {
  /// The named route for this screen.
  static const String routeName = '/card';

  /// Creates a [CardScreen].
  const CardScreen({super.key});

  @override
  State<CardScreen> createState() => _CardScreenState();
}

/// The state for [CardScreen], managing the text controllers and validation logic.
class _CardScreenState extends State<CardScreen> {
  // Controllers to manage the text input for card details.
  final TextEditingController cardController = TextEditingController();
  final TextEditingController dateController = TextEditingController();
  final TextEditingController cvvController = TextEditingController();

  /// Validates the input fields and adds the card.
  ///
  /// If any field is empty, it shows a [SnackBar] with an error message.
  /// Otherwise, it navigates back to the [WalletScreen].
  void _addCard() {
    // Trim the input text to remove any leading or trailing whitespace.
    final card = cardController.text.trim();
    final date = dateController.text.trim();
    final cvv = cvvController.text.trim();

    // Validate that all fields have been filled.
    if (card.isEmpty || date.isEmpty || cvv.isEmpty) {
      // Show an error message if validation fails.
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all fields')),
      );
      return;
    }

    // Proceed to the wallet screen once validation is successful.
    Navigator.pushNamed(context, WalletScreen.routeName);
  }

  @override
  void dispose() {
    // Dispose the controllers to free up resources.
    cardController.dispose();
    dateController.dispose();
    cvvController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      // App bar with the screen title.
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F1F91),
        title: const Text(
          'Add Card',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      // Main content area with padding.
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Header banner instructing the user.
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFF0F1F91),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Text(
                'Enter your card details',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Input field for the card number.
            TextField(
              controller: cardController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Card Number',
                prefixIcon: const Icon(Icons.credit_card),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 15),
            // Row for date and CVV inputs.
            Row(
              children: [
                // Input field for the expiry date.
                Expanded(
                  child: TextField(
                    controller: dateController,
                    keyboardType: TextInputType.datetime,
                    decoration: InputDecoration(
                      labelText: 'MM/YY',
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                // Input field for the CVV code.
                Expanded(
                  child: TextField(
                    controller: cvvController,
                    keyboardType: TextInputType.number,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'CVV',
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            // Spacer to push the button to the bottom of the screen.
            const Spacer(),
            // Button to submit the card details.
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _addCard,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange,
                  padding: const EdgeInsets.all(16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: const Text(
                  'Add Card',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}