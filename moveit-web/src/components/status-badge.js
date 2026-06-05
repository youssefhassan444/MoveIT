export const createStatusBadge = (status) => {
  let label = status;
  let icon = '';
  let className = `badge badge-${status}`;

  switch (status) {
    case 'pending':
      label = 'Pending';
      icon = 'clock';
      break;
    case 'accepted':
      label = 'Accepted';
      icon = 'check-circle';
      break;
    case 'in_transit':
      label = 'In Transit';
      icon = 'truck';
      className = 'badge badge-in-transit'; // mapping underscore
      break;
    case 'delivered':
      label = 'Delivered';
      icon = 'check-circle-2';
      break;
    case 'cancelled':
      label = 'Cancelled';
      icon = 'x-circle';
      break;
    // Report statuses
    case 'in_review':
      label = 'In Review';
      icon = 'eye';
      className = 'badge badge-in-review';
      break;
    case 'resolved':
      label = 'Resolved';
      icon = 'check-circle';
      break;
    case 'dismissed':
      label = 'Dismissed';
      icon = 'slash';
      break;
    default:
      label = status.replace('_', ' ');
      icon = 'info';
      break;
  }

  return `
    <span class="${className}">
      <i data-lucide="${icon}" style="width: 14px; height: 14px"></i>
      ${label}
    </span>
  `;
};
