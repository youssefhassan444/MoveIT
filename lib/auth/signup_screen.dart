// ignore_for_file: unawaited_futures
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_theme.dart';
import '../../core/widgets/custom_snackbar.dart';
import '../../core/errors/app_error.dart';
import '../../services/auth_service.dart';

class SignupScreen extends HookConsumerWidget {
  const SignupScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final nameCtrl = useTextEditingController();
    final emailCtrl = useTextEditingController();
    final passCtrl = useTextEditingController();
    final confirmCtrl = useTextEditingController();
    final licensePlateCtrl = useTextEditingController();
    final role = useState('customer');
    final vehicleType = useState<String>('motorcycle');
    final loading = useState(false);
    final formKey = useMemoized(() => GlobalKey<FormState>());

    Future<void> signup() async {
      if (!formKey.currentState!.validate()) {
        HapticFeedback.mediumImpact();
        return;
      }
      loading.value = true;
      final result = await ref.read(authServiceProvider).signUp(
            email: emailCtrl.text.trim(),
            password: passCtrl.text.trim(),
            displayName: nameCtrl.text.trim(),
            role: role.value,
            vehicleType: role.value == 'driver' ? vehicleType.value : null,
            licensePlate: role.value == 'driver' ? licensePlateCtrl.text.trim() : null,
          );
      loading.value = false;

      if (!context.mounted) return;
      result.when(
        success: (_) => context.go('/auth'),
        failure: (error) {
          HapticFeedback.heavyImpact();
          CustomSnackBar.show(
            context,
            message: AppError.mapMessage(error),
            type: SnackBarType.error,
          );
        },
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: formKey,
              child: Column(
                children: [
                  Image.asset(
                    'assets/moveit_master/moveit.png',
                    height: 100,
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'Sign Up',
                    style: TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                      color: Colors.amber,
                    ),
                  ),
                  const SizedBox(height: 30),
                  
                  // Role Toggle (Functionality from V2)
                  _RoleToggle(
                    selected: role.value,
                    onChanged: (v) => role.value = v,
                  ),
                  const SizedBox(height: 24),

                  TextFormField(
                    controller: nameCtrl,
                    textCapitalization: TextCapitalization.words,
                    decoration: InputDecoration(
                      labelText: 'Name',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      filled: true,
                      fillColor: Colors.grey[50],
                    ),
                    validator: (v) => (v == null || v.trim().isEmpty)
                        ? 'Enter your name'
                        : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: emailCtrl,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      labelText: 'Email',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      filled: true,
                      fillColor: Colors.grey[50],
                    ),
                    validator: (v) => (v == null || !v.contains('@'))
                        ? 'Enter a valid email'
                        : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: passCtrl,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      filled: true,
                      fillColor: Colors.grey[50],
                    ),
                    validator: (v) => (v == null || v.length < 6)
                        ? 'Password must be 6+ characters'
                        : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: confirmCtrl,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Confirm Password',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      filled: true,
                      fillColor: Colors.grey[50],
                    ),
                    validator: (v) =>
                        v != passCtrl.text ? 'Passwords do not match' : null,
                  ),

                  // Driver Vehicle Type
                  AnimatedSize(
                    duration: const Duration(milliseconds: 300),
                    child: role.value == 'driver'
                        ? Column(children: [
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: licensePlateCtrl,
                              textCapitalization: TextCapitalization.characters,
                              decoration: InputDecoration(
                                labelText: 'License Plate',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                filled: true,
                                fillColor: Colors.grey[50],
                              ),
                              validator: (v) => (role.value == 'driver' && (v == null || v.trim().isEmpty))
                                  ? 'Enter your license plate'
                                  : null,
                            ),
                            const SizedBox(height: 16),
                            DropdownButtonFormField<String>(
                              initialValue: vehicleType.value,
                              dropdownColor: Colors.white,
                              decoration: InputDecoration(
                                labelText: 'Vehicle Type',
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                filled: true,
                                fillColor: Colors.grey[50],
                              ),
                              items: [
                                DropdownMenuItem(
                                  value: 'motorcycle',
                                  child: Row(
                                    children: [
                                      Image.asset('assets/moveit_master/easy.jpeg', width: 40, height: 25, fit: BoxFit.contain),
                                      const SizedBox(width: 10),
                                      const Text('Motorcycle'),
                                    ],
                                  ),
                                ),
                                DropdownMenuItem(
                                  value: 'mini_truck',
                                  child: Row(
                                    children: [
                                      Image.asset('assets/moveit_master/suz.jpeg', width: 40, height: 25, fit: BoxFit.contain),
                                      const SizedBox(width: 10),
                                      const Text('Mini-Truck'),
                                    ],
                                  ),
                                ),
                                DropdownMenuItem(
                                  value: 'truck',
                                  child: Row(
                                    children: [
                                      Image.asset('assets/moveit_master/nos.jpeg', width: 40, height: 25, fit: BoxFit.contain),
                                      const SizedBox(width: 10),
                                      const Text('Truck'),
                                    ],
                                  ),
                                ),
                                DropdownMenuItem(
                                  value: 'heavy_truck',
                                  child: Row(
                                    children: [
                                      Image.asset('assets/moveit_master/heavy.jpeg', width: 40, height: 25, fit: BoxFit.contain),
                                      const SizedBox(width: 10),
                                      const Text('Heavy Truck'),
                                    ],
                                  ),
                                ),
                                DropdownMenuItem(
                                  value: 'refrigerated_truck',
                                  child: Row(
                                    children: [
                                      Image.asset('assets/moveit_master/big.jpeg', width: 40, height: 25, fit: BoxFit.contain),
                                      const SizedBox(width: 10),
                                      const Text('Refrigerated Truck'),
                                    ],
                                  ),
                                ),
                              ],
                              onChanged: (v) => vehicleType.value = v!,
                            ),
                          ],)
                        : const SizedBox.shrink(),
                  ),

                  const SizedBox(height: 40),

                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: loading.value ? null : signup,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brandNavy,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: loading.value
                          ? const SizedBox(
                              height: 24,
                              width: 24,
                              child: CircularProgressIndicator(
                                  color: Colors.white, strokeWidth: 2,),)
                          : const Text(
                              'CONTINUE',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  TextButton(
                    onPressed: () => context.pop(),
                    child: const Text(
                      'Already have an account? Login',
                      style: TextStyle(
                          color: AppTheme.brandNavy, fontWeight: FontWeight.bold,),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RoleToggle extends StatelessWidget {
  final String selected;
  final ValueChanged<String> onChanged;
  const _RoleToggle({required this.selected, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          _Tab(
              label: 'Customer',
              value: 'customer',
              selected: selected,
              onChanged: onChanged,),
          _Tab(
              label: 'Driver',
              value: 'driver',
              selected: selected,
              onChanged: onChanged,),
        ],
      ),
    );
  }
}

class _Tab extends StatelessWidget {
  final String label, value, selected;
  final ValueChanged<String> onChanged;
  const _Tab(
      {required this.label,
      required this.value,
      required this.selected,
      required this.onChanged,});

  @override
  Widget build(BuildContext context) {
    final active = selected == value;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          HapticFeedback.lightImpact();
          onChanged(value);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: active ? AppTheme.brandSkyBlue : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(label,
              style: TextStyle(
                  color: active ? Colors.white : AppTheme.brandNavy,
                  fontWeight: FontWeight.bold,),),
        ),
      ),
    );
  }
}
