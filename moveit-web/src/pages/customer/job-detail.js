import { AuthService } from '../../services/auth.js';
import { JobsService } from '../../services/jobs.js';
import { TrackingService } from '../../services/tracking.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { createStatusBadge } from '../../components/status-badge.js';
import { MapWidget } from '../../components/map.js';
import { auth } from '../../firebase.js';
import { Toast } from '../../components/toast.js';

export const renderCustomerJobDetail = async (params) => {
  const jobId = params.id;
  if (!jobId) return document.createElement('div');

  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  // Highlight 'Active Jobs' or 'History' based on status, but default to jobs
  container.appendChild(createSidebar('customer', '/customer/jobs'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl';
  content.innerHTML = `<div class="spinner"></div>`;
  mainContent.appendChild(content);
  container.appendChild(mainContent);

  let mapWidget = null;
  let currentJob = null;

  const renderContent = (job) => {
    currentJob = job;
    const priceEGP = (job.pricePiastres / 100).toFixed(2);
    const dateStr = job.createdAt 
      ? new Intl.DateTimeFormat('en-EG', { 
          month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        }).format(job.createdAt.toDate())
      : '';

    const canCancel = job.status === 'pending';
    const isCompleted = job.status === 'delivered' || job.status === 'cancelled';

    content.innerHTML = `
      <div class="page-header flex justify-between items-center mb-xl">
        <div>
          <div class="flex items-center gap-md mb-xs">
            <h1 class="page-title m-0">Job Details</h1>
            <div id="status-badge-container">${createStatusBadge(job.status)}</div>
          </div>
          <p class="page-subtitle">ID: ${job.id}</p>
        </div>
        <div class="flex gap-sm">
          ${canCancel ? `<button class="btn btn-outline" id="btn-cancel" style="color: var(--brand-error); border-color: var(--brand-error)">Cancel Job</button>` : ''}
          ${isCompleted ? `<button class="btn btn-primary" id="btn-rebook"><i data-lucide="refresh-cw"></i> Rebook</button>` : ''}
        </div>
      </div>

      <div class="job-detail">
        <div class="job-detail__map map-container" id="job-map"></div>
        
        <div class="job-detail__info">
          <!-- Status Tracker -->
          <div class="job-detail__status-stepper">
            <h3 class="text-title mb-md">Tracking</h3>
            ${renderStepper(job.status)}
          </div>

          <!-- Driver Info (if accepted) -->
          ${job.driverId ? `
            <div class="job-detail__driver-card">
              <div class="job-detail__driver-avatar">
                ${job.driverName ? job.driverName.charAt(0).toUpperCase() : 'D'}
              </div>
              <div>
                <div class="job-detail__driver-name">${job.driverName || 'Your Driver'}</div>
                <div class="job-detail__driver-vehicle">${job.driverPhone || ''}</div>
              </div>
            </div>
          ` : `
            <div class="card p-lg text-center bg-grey-50">
              <div class="spinner spinner-sm mb-sm mx-auto"></div>
              <p class="text-secondary text-sm">Searching for nearby drivers...</p>
            </div>
          `}

          <!-- Details -->
          <div class="card p-lg">
            <h3 class="text-title mb-md">Order Info</h3>
            
            <div class="review-row">
              <div class="review-row__label">Date</div>
              <div class="review-row__value">${dateStr}</div>
            </div>
            <div class="review-row">
              <div class="review-row__label">Vehicle</div>
              <div class="review-row__value" style="text-transform: capitalize">${job.vehicleTypeRequired}</div>
            </div>
            <div class="review-row">
              <div class="review-row__label">Item</div>
              <div class="review-row__value">${job.itemDescription}</div>
            </div>
            <div class="review-row">
              <div class="review-row__label">Notes</div>
              <div class="review-row__value text-right" style="max-width: 60%">${job.notes || '-'}</div>
            </div>
            <div class="review-row">
              <div class="review-row__label">Payment</div>
              <div class="review-row__value text-success">Cash on Delivery</div>
            </div>
            <div class="review-row review-row--total">
              <div class="review-row__label">Total Price</div>
              <div class="review-row__value">${priceEGP} EGP</div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons({ root: content });

    // Initialize map
    if (!mapWidget) {
      mapWidget = new MapWidget('job-map', { interactive: true });
      mapWidget.init().then(() => {
        mapWidget.setMarker('pickup', job.pickupLat, job.pickupLng, 'pickup', 'Pickup Location');
        mapWidget.setMarker('dropoff', job.dropoffLat, job.dropoffLng, 'dropoff', 'Dropoff Location');
        mapWidget.fitBoundsToMarkers();
      });
    }

    // Attach button listeners
    const cancelBtn = content.querySelector('#btn-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to cancel this job?')) {
          try {
            await JobsService.cancelJob(job.id);
            Toast.success('Job cancelled successfully');
          } catch (error) {
            Toast.error(error.message);
          }
        }
      });
    }

    const rebookBtn = content.querySelector('#btn-rebook');
    if (rebookBtn) {
      rebookBtn.addEventListener('click', async () => {
        try {
          await JobsService.repostJob(job.id);
          Toast.success('Job rebooked successfully');
        } catch (error) {
          Toast.error(error.message);
        }
      });
    }
  };

  const renderStepper = (status) => {
    const steps = [
      { id: 'pending', label: 'Searching' },
      { id: 'accepted', label: 'Driver Assigned' },
      { id: 'in_transit', label: 'In Transit' },
      { id: 'delivered', label: 'Delivered' }
    ];

    if (status === 'cancelled') {
      return `<div class="text-error font-bold text-center py-md">This job was cancelled.</div>`;
    }

    let currentIndex = steps.findIndex(s => s.id === status);
    if (currentIndex === -1) currentIndex = 0;

    let html = '<div class="wizard-stepper" style="margin:0; padding:0">';
    steps.forEach((step, index) => {
      let state = 'upcoming';
      if (index < currentIndex) state = 'completed';
      if (index === currentIndex) state = 'active';

      html += `
        <div class="wizard-step wizard-step--${state}" ${index === steps.length - 1 ? 'style="flex:0"' : ''}>
          <div class="wizard-step__number">
            ${state === 'completed' ? '<i data-lucide="check" style="width:14px;height:14px"></i>' : (index + 1)}
          </div>
          <div class="wizard-step__connector"></div>
        </div>
      `;
    });
    html += '</div>';
    
    // Add labels below
    html += '<div class="flex justify-between mt-sm">';
    steps.forEach((step, index) => {
      let colorClass = index <= currentIndex ? 'text-primary font-bold' : 'text-secondary';
      html += `<div class="text-xs ${colorClass}" style="text-align: center; width: 40px; margin-left: ${index === 0 ? '-10px' : index === steps.length - 1 ? '-20px' : '-10px'}">${step.label}</div>`;
    });
    html += '</div>';

    return html;
  };

  // Subscriptions
  let unsubscribeTracking = null;

  const unsubscribeJob = JobsService.subscribeToJob(jobId, (job) => {
    const isInitialRender = !currentJob;
    const statusChanged = currentJob && currentJob.status !== job.status;

    if (isInitialRender || statusChanged) {
      renderContent(job);
    } else {
      // Just update status badge to avoid full re-render
      const badgeContainer = content.querySelector('#status-badge-container');
      if (badgeContainer) badgeContainer.innerHTML = createStatusBadge(job.status);
    }

    // Handle real-time tracking if accepted or in_transit
    if (job.status === 'accepted' || job.status === 'in_transit') {
      if (!unsubscribeTracking) {
        unsubscribeTracking = TrackingService.watchDriverLocation(job.id, (trackingData) => {
          if (trackingData && mapWidget) {
            mapWidget.setMarker('driver', trackingData.lat, trackingData.lng, 'driver', 'Driver Location');
          }
        });
      }
    } else {
      if (unsubscribeTracking) {
        unsubscribeTracking();
        unsubscribeTracking = null;
      }
      if (mapWidget) mapWidget.removeMarker('driver');
    }
  });

  // Cleanup
  const cleanup = () => {
    unsubscribeJob();
    if (unsubscribeTracking) unsubscribeTracking();
    if (mapWidget) mapWidget.destroy();
    window.removeEventListener('hashchange', cleanup);
  };
  window.addEventListener('hashchange', cleanup);

  return container;
};
