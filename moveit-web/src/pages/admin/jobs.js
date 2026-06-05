import { AuthService } from '../../services/auth.js';
import { JobsService } from '../../services/jobs.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { createStatusBadge } from '../../components/status-badge.js';
import { createEmptyState } from '../../components/empty-state.js';
import { auth } from '../../firebase.js';

export const renderAdminJobs = async () => {
  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  container.appendChild(createSidebar('admin', '/admin/jobs'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl flex-col h-full';
  content.style.maxWidth = '1200px';
  content.style.margin = '0 auto';
  
  content.innerHTML = `
    <div class="page-header flex justify-between items-center mb-xl">
      <div>
        <h1 class="page-title">All Jobs</h1>
        <p class="page-subtitle">Monitor all system deliveries</p>
      </div>
      <div class="flex gap-sm items-center">
        <label class="text-sm font-bold">Status:</label>
        <select class="form-input w-auto" id="job-status-filter">
          <option value="all">All Jobs</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div class="card p-0" style="overflow-x: auto;">
      <table class="w-full text-left" style="min-width: 800px">
        <thead class="bg-grey-50 border-b border-light text-sm text-secondary">
          <tr>
            <th class="p-md font-bold">ID / Date</th>
            <th class="p-md font-bold">Customer</th>
            <th class="p-md font-bold">Route</th>
            <th class="p-md font-bold">Vehicle / Price</th>
            <th class="p-md font-bold text-center">Status</th>
          </tr>
        </thead>
        <tbody id="jobs-table-body">
          <tr><td colspan="5" class="p-xl text-center"><div class="spinner mx-auto"></div></td></tr>
        </tbody>
      </table>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  const loadJobs = async (status = 'all') => {
    const tbody = container.querySelector('#jobs-table-body');
    tbody.innerHTML = '<tr><td colspan="5" class="p-xl text-center"><div class="spinner mx-auto"></div></td></tr>';

    try {
      const jobs = await JobsService.getAllJobs({ status });
      
      if (jobs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-xl">${createEmptyState('No jobs found', 'Try changing your filter.', 'package')}</td></tr>`;
        return;
      }

      tbody.innerHTML = '';
      jobs.forEach(job => {
        const dateStr = job.createdAt ? new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }).format(job.createdAt.toDate()) : '';
        const priceEGP = (job.pricePiastres / 100).toFixed(2);

        tbody.innerHTML += `
          <tr class="border-b border-light hover:bg-grey-50 transition-colors">
            <td class="p-md align-top">
              <div class="font-bold text-sm" style="font-family: monospace">${job.id.substring(0,8)}</div>
              <div class="text-xs text-secondary mt-xs">${dateStr}</div>
            </td>
            <td class="p-md align-top">
              <div class="font-bold text-sm">${job.customerName || 'Unknown'}</div>
              <div class="text-xs text-secondary mt-xs">${job.customerPhone || ''}</div>
            </td>
            <td class="p-md align-top">
              <div class="flex items-start gap-sm mb-xs">
                <div class="w-2 h-2 rounded-full bg-brand-success mt-1"></div>
                <div class="text-xs truncate" style="max-width: 250px" title="${job.pickupAddress}">${job.pickupAddress}</div>
              </div>
              <div class="flex items-start gap-sm">
                <div class="w-2 h-2 rounded-full bg-brand-error mt-1"></div>
                <div class="text-xs truncate" style="max-width: 250px" title="${job.dropoffAddress}">${job.dropoffAddress}</div>
              </div>
            </td>
            <td class="p-md align-top">
              <div class="font-bold text-sm capitalize">${job.vehicleTypeRequired}</div>
              <div class="text-sm mt-xs">${priceEGP} EGP</div>
            </td>
            <td class="p-md align-top text-center">
              ${createStatusBadge(job.status)}
            </td>
          </tr>
        `;
      });

    } catch (error) {
      tbody.innerHTML = `<tr><td colspan="5" class="p-xl text-center text-error">Failed to load jobs</td></tr>`;
    }
  };

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons({ root: container });
    
    loadJobs();
    
    const filter = container.querySelector('#job-status-filter');
    filter.addEventListener('change', (e) => loadJobs(e.target.value));
  }, 0);

  return container;
};
