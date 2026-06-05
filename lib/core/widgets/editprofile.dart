import 'package:flutter/material.dart';
import '../../models/user_model.dart';

class EditProfilePage extends StatefulWidget {
  final UserModel? user;

  const EditProfilePage({super.key, required this.user});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  late TextEditingController nameController;
  late TextEditingController emailController;

  static const darkBlue = Color(0xFF0F1F91);
  static const bg = Color(0xFFF4F7FC);
  static const accent = Color(0xFFFF8C42);

  @override
  void initState() {
    super.initState();
    nameController =
        TextEditingController(text: widget.user?.displayName ?? '');
    emailController =
        TextEditingController(text: widget.user?.email ?? '');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bg,

      appBar: AppBar(
        backgroundColor: darkBlue,
        elevation: 0,
        title: const Text(
          'Edit Profile',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            letterSpacing: 0.5,
          ),
        ),
        centerTitle: true,
      ),

      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [

              const SizedBox(height: 10),

              // ================= PROFILE IMAGE =================
              Container(
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: accent, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withAlpha(15),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const CircleAvatar(
                  radius: 48,
                  backgroundColor: Colors.white,
                  child: Icon(
                    Icons.person,
                    size: 48,
                    color: Colors.grey,
                  ),
                ),
              ),

              const SizedBox(height: 30),

              // ================= NAME =================
              _field(
                controller: nameController,
                label: 'Full Name',
                icon: Icons.person_outline,
                enabled: true,
              ),

              const SizedBox(height: 16),

              // ================= EMAIL =================
              _field(
                controller: emailController,
                label: 'Email Address',
                icon: Icons.email_outlined,
                enabled: false,
              ),

              const SizedBox(height: 30),

              // ================= SAVE BUTTON =================
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: accent,
                    elevation: 8,
                    shadowColor: accent.withValues(alpha: 0.4),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Text(
                    'Save Changes',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ================= INPUT FIELD =================
  Widget _field({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool enabled = true,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
      ),

      child: TextField(
        controller: controller,
        enabled: enabled,

        style: const TextStyle(
          color: Colors.black87,
          fontWeight: FontWeight.w600,
        ),

        cursorColor: darkBlue,

        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon, color: darkBlue),

          labelStyle: const TextStyle(
            color: Colors.grey,
            fontWeight: FontWeight.w500,
          ),

          filled: true,
          fillColor: Colors.white,

          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 16,
          ),

          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),

          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(
              color: Colors.grey.shade200,
            ),
          ),

          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(
              color: accent,
              width: 1.5,
            ),
          ),
        ),
      ),
    );
  }
}