import { createStatusBadge } from './status-badge.js';

export const createJobCard = (job, onClick) => {
  const card = document.createElement('div');
  card.className = 'job-card';
  if (onClick) {
    card.addEventListener('click', onClick);
  }

  // Format date
  const dateStr = job.createdAt 
    ? new Intl.DateTimeFormat('en-EG', { 
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      }).format(job.createdAt.toDate())
    : 'Just now';

  // Format price (piastres to EGP)
  const priceEGP = (job.pricePiastres / 100).toFixed(2);

  card.innerHTML = `
    <div class="job-card__header">
      <div class="job-card__vehicle">
        <img src="/vehicles/${getVehicleImage(job.vehicleTypeRequired)}" alt="${job.vehicleTypeRequired}" class="job-card__vehicle-icon" />
        <span class="truncate" style="max-width: 150px">${job.itemDescription}</span>
      </div>
      ${createStatusBadge(job.status)}
    </div>

    <div class="job-card__route">
      <div class="job-card__location job-card__location--pickup">
        <div class="job-card__location-dot"></div>
        <div class="truncate text-body-sm">${job.pickupAddress}</div>
      </div>
      <div class="job-card__location job-card__location--dropoff">
        <div class="job-card__location-dot"></div>
        <div class="truncate text-body-sm">${job.dropoffAddress}</div>
      </div>
    </div>

    <div class="job-card__footer">
      <div class="job-card__date">${dateStr}</div>
      <div class="job-card__price">${priceEGP} EGP</div>
    </div>
  `;

  return card;
};

// Helper to map vehicle type to image file
function getVehicleImage(type) {
  switch (type.toLowerCase()) {
    case 'motorcycle': return 'gofast.jpeg';
    case 'car': 
    case 'van': return 'trucksend.jpeg';
    case 'truck': return 'heavyload.jpeg';
    default: return 'easygo.jpeg';
  }
}
