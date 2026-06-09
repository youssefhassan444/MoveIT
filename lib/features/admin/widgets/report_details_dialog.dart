// ignore_for_file: unused_local_variable, deprecated_member_use
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';

import '../../../models/report_model.dart';
import '../../../services/job_service.dart';
import '../../../services/auth_service.dart';
import '../../../services/chat_service.dart';
import '../../../core/theme/app_theme.dart';

/// A dialog that displays comprehensive details about a specific report.
///
/// It shows the report's metadata, description, associated job details,
/// and the chat history related to the reported job.
class ReportDetailsDialog extends ConsumerWidget {
  /// The report to display details for.
  final ReportModel report;
  
  /// Creates a [ReportDetailsDialog].
  const ReportDetailsDialog({super.key, required this.report});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        width: 900,
        height: 700,
        padding: const EdgeInsets.all(0),
        child: Column(
          children: [
            _buildHeader(context),
            Expanded(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Left side: Report and Job Details
                  Expanded(
                    flex: 1,
                    child: Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        border: Border(right: BorderSide(color: Colors.grey[200]!)),
                      ),
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildReportDetails(),
                            const Divider(height: 32),
                            // Only load job details if a job ID is associated
                            if (report.jobId != null && report.jobId!.isNotEmpty) 
                              _buildJobDetails(ref)
                            else
                              const Text('No Job Linked', style: TextStyle(color: Colors.grey)),
                          ],
                        ),
                      ),
                    ),
                  ),
                  
                  // Right side: Job Chat History
                  Expanded(
                    flex: 1,
                    child: Container(
                      color: const Color(0xFFF8FAFC),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Padding(
                            padding: EdgeInsets.all(16.0),
                            child: Text('Job Chat History', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.brandNavy)),
                          ),
                          const Divider(height: 1),
                          Expanded(
                            child: (report.jobId != null && report.jobId!.isNotEmpty)
                                ? _buildChatLog(ref)
                                : const Center(child: Text('No job attached to this report.')),
                          ),
                        ],
                      ),
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

  /// Builds the top header bar of the dialog with title and close button.
  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: const BoxDecoration(
        color: AppTheme.brandNavy,
        borderRadius: BorderRadius.only(topLeft: Radius.circular(16), topRight: Radius.circular(16)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('Report: ${report.subject}', style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          IconButton(
            icon: const Icon(Icons.close, color: Colors.white),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  /// Builds the section displaying the report's metadata and description.
  Widget _buildReportDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Report Information', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.brandNavy)),
        const SizedBox(height: 16),
        _buildInfoRow('Reporter', '${report.reporterName} (${report.reporterRole.toUpperCase()})'),
        _buildInfoRow('Reporter Email', report.reporterEmail),
        _buildInfoRow('Report Date', DateFormat('MMM dd, yyyy HH:mm').format(report.createdAt)),
        _buildInfoRow('Priority', report.priority.toUpperCase()),
        const SizedBox(height: 16),
        const Text('Description', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 4),
        Text(report.description, style: const TextStyle(fontSize: 14, color: Colors.black87)),
      ],
    );
  }

  /// Builds the section displaying details about the associated job.
  Widget _buildJobDetails(WidgetRef ref) {
    // Watch the specific job data
    final jobAsync = ref.watch(singleJobProvider(report.jobId!));
    
    return jobAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => Text('Error loading job: $e', style: const TextStyle(color: Colors.red)),
      data: (job) {
        if (job == null) return const Text('Job not found.');
        
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Delivery Details', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.brandNavy)),
            const SizedBox(height: 16),
            _buildInfoRow('Job ID', job.id),
            _buildInfoRow('Status', job.status.toUpperCase()),
            _buildInfoRow('Item', job.itemDescription),
            _buildInfoRow('Pickup', job.pickupAddress),
            _buildInfoRow('Drop-off', job.dropoffAddress),
            _buildInfoRow('Price', '${(job.pricePiastres / 100).toStringAsFixed(2)} EGP'),
            const SizedBox(height: 24),
            const Text('Involved Users', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.brandNavy)),
            const SizedBox(height: 16),
            _buildUserSection(ref, 'Customer', job.customerId),
            const SizedBox(height: 16),
            if (job.driverId != null) 
              _buildUserSection(ref, 'Driver', job.driverId!)
            else
              const Text('No driver assigned to this job.', style: TextStyle(color: Colors.grey)),
          ],
        );
      },
    );
  }
  
  /// Builds a small profile card for an involved user (e.g., driver or customer).
  Widget _buildUserSection(WidgetRef ref, String roleTitle, String uid) {
    final userAsync = ref.watch(userByIdProvider(uid));
    
    return userAsync.when(
      loading: () => const Padding(
        padding: EdgeInsets.only(left: 16.0),
        child: CircularProgressIndicator(),
      ),
      error: (e, st) => Text('Error loading $roleTitle: $e'),
      data: (user) {
        if (user == null) return Text('$roleTitle not found.');
        return Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.grey[50],
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.grey[200]!),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(roleTitle, style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey[600], fontSize: 12)),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.person, size: 16, color: AppTheme.brandNavy),
                  const SizedBox(width: 8),
                  Text(user.displayName, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.black87)),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.email, size: 16, color: Colors.grey),
                  const SizedBox(width: 8),
                  Text(user.email, style: TextStyle(color: Colors.grey[800])),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  /// Builds the chat log history for the associated job.
  Widget _buildChatLog(WidgetRef ref) {
    // Watch the chat messages for the job
    final chatAsync = ref.watch(chatMessagesProvider(report.jobId!));
    
    return chatAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => Center(child: Text('Error loading chat: $e')),
      data: (messages) {
        if (messages.isEmpty) return const Center(child: Text('No messages found for this job.', style: TextStyle(color: Colors.grey)));
        
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: messages.length,
          itemBuilder: (context, index) {
            final msg = messages[index];
            final isCustomer = msg.senderId == report.reporterId; // Not strictly true if reporter is driver, but we style randomly or by ID
            // We just align left or right based on role, let's just make it a clean log
            
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 2, offset: const Offset(0, 1))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(msg.senderName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.brandNavy)),
                      Text(DateFormat('MMM dd, HH:mm').format(msg.createdAt), style: const TextStyle(fontSize: 10, color: Colors.grey)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(msg.text, style: const TextStyle(fontSize: 14, color: Colors.black87)),
                ],
              ),
            );
          },
        );
      },
    );
  }

  /// Helper to build a label-value row.
  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(label, style: TextStyle(fontWeight: FontWeight.w600, color: Colors.grey[600])),
          ),
          Expanded(
            child: Text(value, style: const TextStyle(fontWeight: FontWeight.w500, color: Colors.black87)),
          ),
        ],
      ),
    );
  }
}
