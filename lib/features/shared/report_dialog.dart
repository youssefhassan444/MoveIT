import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_theme.dart';
import '../../services/report_service.dart';
import '../../services/auth_service.dart';
import '../../models/report_model.dart';


/// A dialog widget that allows users to submit issue reports.
///
/// This dialog can be associated with a specific [jobId] and collects a
/// subject and description for the report. It uses [reportServiceProvider]
/// to submit the report to the backend.
class ReportDialog extends ConsumerStatefulWidget {
  final String? jobId;

  const ReportDialog({super.key, this.jobId});

  @override
  ConsumerState<ReportDialog> createState() => _ReportDialogState();

  static Future<void> show(BuildContext context, {String? jobId}) async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ReportDialog(jobId: jobId),
    );
  }
}

class _ReportDialogState extends ConsumerState<ReportDialog> {
  // Controllers for the report's subject and description input fields.
  final _subjectController = TextEditingController();
  final _descriptionController = TextEditingController();
  
  // State to manage the loading indicator during submission.
  bool _isSubmitting = false;

  @override
  void dispose() {
    _subjectController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  /// Handles the submission of the report.
  void _submit() async {
    final subject = _subjectController.text.trim();
    final description = _descriptionController.text.trim();

    // Validate that both fields are filled out.
    if (subject.isEmpty || description.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill out all fields.')),
      );
      return;
    }

    // Retrieve the current user's details.
    final userModel = ref.read(currentUserDocProvider).value;

    if (userModel == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You must be logged in to report.')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      // Construct the report model.
      final report = ReportModel(
        id: '',
        reporterId: userModel.uid,
        reporterName: userModel.displayName,
        reporterEmail: userModel.email,
        reporterRole: userModel.role,
        subject: subject,
        description: description,
        jobId: widget.jobId,
        priority: 'medium', // Default priority
        status: 'pending',
        createdAt: DateTime.now(),
      );

      // Submit the report via the report service.
      await ref.read(reportServiceProvider).submitReport(report);

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Report submitted successfully.')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to submit report: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Report an Issue',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.brandNavy,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (widget.jobId != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Text(
                'Related Job: ${widget.jobId!.substring(0, 8)}',
                style: const TextStyle(
                  color: Colors.grey,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          TextField(
            controller: _subjectController,
            decoration: const InputDecoration(
              labelText: 'Subject',
              hintText: 'E.g., Late delivery, App issue',
              border: OutlineInputBorder(),
            ),
            textCapitalization: TextCapitalization.sentences,
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _descriptionController,
            maxLines: 4,
            decoration: const InputDecoration(
              labelText: 'Description',
              hintText: 'Please describe the issue in detail...',
              border: OutlineInputBorder(),
            ),
            textCapitalization: TextCapitalization.sentences,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: _isSubmitting ? null : _submit,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.brandOrange,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isSubmitting
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 2,
                    ),
                  )
                : const Text(
                    'Submit Report',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
          ),
        ],
      ),
      ),
    );
  }
}
