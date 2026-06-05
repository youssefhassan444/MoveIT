import 'package:flutter/material.dart';
import '../../../models/job_model.dart';
import 'driver_job_card.dart';

class JobBoardItem extends StatelessWidget {
  final JobModel job;
  final VoidCallback? onAccept;
  final bool accepting;

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
