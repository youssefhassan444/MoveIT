import 'package:flutter/material.dart';

class JobBoardFilters extends StatelessWidget {
  final String selected;
  final ValueChanged<String> onSelected;

  const JobBoardFilters({
    super.key,
    required this.selected,
    required this.onSelected,
  });

  static const _filters = [
    'All',
    'Nearby',
    'High Pay',
    'Urgent',
    'My Vehicle',
  ];

  static const _blue = Color(0xFF0F1F91);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 50,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: _filters.length,
        separatorBuilder: (_, __) => const SizedBox(width: 10),

        itemBuilder: (context, index) {
          final label = _filters[index];
          final isActive = label == selected;

          return GestureDetector(
            onTap: () => onSelected(label),

            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),

              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 10,
              ),

              decoration: BoxDecoration(
                color: isActive ? _blue : Colors.white,

                borderRadius: BorderRadius.circular(14),

                border: Border.all(
                  color: isActive
                      ? _blue
                      : const Color(0xFFD1D5DB),
                  width: 1.2,
                ),

                boxShadow: const [
                  BoxShadow(
                    color: Color(0x14000000),
                    blurRadius: 8,
                    offset: Offset(0, 3),
                  ),
                ],
              ),

              child: Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,

                  color: isActive
                      ? Colors.white
                      : _blue,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}