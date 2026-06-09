import 'package:flutter/material.dart';
import '../../../models/job_model.dart';
import 'driver_job_card.dart';

/// A wrapper widget that presents a [DriverJobCard] specifically for the job board.
///
/// It adds specific padding, borders, and passes an 'Accept Job' action
/// down to the underlying job card. It also handles the loading state
/// when a job is actively being accepted.
class JobBoardItem extends StatelessWidget {
  /// The job data to display.
  final JobModel job;
  /// Callback triggered when the driver tries to accept this job.
  final VoidCallback? onAccept;
  /// Whether an accept request is currently in flight.
  final bool accepting;

  /// Creates a [JobBoardItem].
  const JobBoardItem({super.key, required this.job, this.onAccept, this.accepting = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(border: const Border(left: BorderSide(color: Colors.blueAccent, width: 4)), borderRadius: BorderRadius.circular(8)),
      child: DriverJobCard(
        job: job,
        actionLabel: accepting ? 'Accepting...' : 'Accept Job',
        onTap: accepting ? null : onAccept,
      ),
    );
  }
}
