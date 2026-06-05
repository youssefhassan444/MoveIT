import { AuthService } from '../../services/auth.js';
import { ReportsService } from '../../services/reports.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { createStatusBadge } from '../../components/status-badge.js';
import { createEmptyState } from '../../components/empty-state.js';
import { auth } from '../../firebase.js';
import { Toast } from '../../components/toast.js';

export const renderAdminReports = async () => {
  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  container.appendChild(createSidebar('admin', '/admin/reports'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl h-full flex flex-col';
  
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Report Management</h1>
      <p class="page-subtitle">Handle customer and driver reports</p>
    </div>

    <div class="report-detail h-full">
      <!-- List View -->
      <div class="card p-0 flex flex-col h-full" style="max-height: calc(100vh - 180px); overflow-y: auto;">
        <div class="p-md border-b border-light bg-grey-50 sticky top-0 z-10 flex gap-sm">
          <select class="form-input" id="filter-status">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div id="reports-list" class="report-list p-md">
          <div class="spinner mx-auto my-xl"></div>
        </div>
      </div>

      <!-- Detail View -->
      <div class="card h-full" id="report-detail-view" style="display: none; max-height: calc(100vh - 180px); overflow-y: auto;">
        <!-- Details injected dynamically -->
      </div>
      <div id="report-detail-empty" class="card flex items-center justify-center text-secondary h-full" style="max-height: calc(100vh - 180px);">
        Select a report to view details
      </div>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  let currentReports = [];
  let selectedReportId = null;

  const renderList = (filterStatus = 'all') => {
    const listEl = container.querySelector('#reports-list');
    listEl.innerHTML = '';

    const filtered = filterStatus === 'all' 
      ? currentReports 
      : currentReports.filter(r => r.status === filterStatus);

    if (filtered.length === 0) {
      listEl.innerHTML = createEmptyState('No reports found', 'Adjust filters to see more results.', 'inbox');
      return;
    }

    filtered.forEach(report => {
      const dateStr = report.createdAt ? new Intl.DateTimeFormat('en-GB').format(report.createdAt.toDate()) : '';
      
      const el = document.createElement('div');
      el.className = `report-card ${selectedReportId === report.id ? 'border-brand-sky-blue bg-grey-50' : ''}`;
      el.innerHTML = `
        <div class="report-card__priority report-card__priority--${report.priority}"></div>
        <div class="report-card__content">
          <div class="report-card__title">${report.subject}</div>
          <div class="report-card__meta">
            <span>${report.reporterEmail}</span>
            <span>•</span>
            <span>${dateStr}</span>
          </div>
        </div>
        <div class="report-card__status">
          ${createStatusBadge(report.status)}
        </div>
      `;

      el.addEventListener('click', () => {
        selectedReportId = report.id;
        renderList(filterStatus); // Re-render to show active state
        renderDetail(report);
      });

      listEl.appendChild(listEl); // wait, bug here
      listEl.appendChild(el);
    });
  };

  const renderDetail = (report) => {
    container.querySelector('#report-detail-empty').style.display = 'none';
    const detailView = container.querySelector('#report-detail-view');
    detailView.style.display = 'block';

    const dateStr = report.createdAt ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short' }).format(report.createdAt.toDate()) : '';

    detailView.innerHTML = `
      <div class="flex justify-between items-start mb-lg border-b border-light pb-md">
        <div>
          <h2 class="text-headline mb-xs">${report.subject}</h2>
          <div class="text-caption text-secondary">ID: ${report.id}</div>
        </div>
        ${createStatusBadge(report.status)}
      </div>

      <div class="grid grid-cols-2 gap-md mb-lg">
        <div class="p-md bg-grey-50 rounded">
          <div class="text-caption font-bold mb-xs">Reporter</div>
          <div class="text-sm">${report.reporterName}</div>
          <div class="text-sm text-secondary">${report.reporterEmail}</div>
          <div class="text-xs mt-xs badge badge-customer inline-block">${report.reporterRole}</div>
        </div>
        <div class="p-md bg-grey-50 rounded">
          <div class="text-caption font-bold mb-xs">Job Reference</div>
          <div class="text-sm">${report.jobId || 'None'}</div>
          <div class="text-caption font-bold mt-sm mb-xs">Date Submitted</div>
          <div class="text-sm">${dateStr}</div>
        </div>
      </div>

      <div class="mb-xl">
        <h3 class="text-title mb-sm">Description</h3>
        <p class="text-body whitespace-pre-wrap">${report.description}</p>
      </div>

      <div class="border-t border-light pt-lg mt-auto">
        <h3 class="text-title mb-md">Admin Actions</h3>
        
        <div class="form-group mb-md">
          <label class="form-label">Response / Resolution Notes (visible to user)</label>
          <textarea id="admin-notes" class="form-input" rows="3">${report.adminResponse || ''}</textarea>
        </div>

        <div class="flex gap-sm">
          ${report.status === 'pending' ? `
            <button class="btn btn-primary flex-1" id="btn-review">Mark In Review</button>
          ` : ''}
          ${report.status !== 'resolved' ? `
            <button class="btn btn-success flex-1" id="btn-resolve">Resolve</button>
          ` : ''}
          ${report.status !== 'dismissed' ? `
            <button class="btn btn-outline flex-1" id="btn-dismiss">Dismiss</button>
          ` : ''}
        </div>
      </div>
    `;

    // Action Handlers
    const getNotes = () => detailView.querySelector('#admin-notes').value.trim();

    const updateStatus = async (status) => {
      try {
        await ReportsService.updateReportStatus(report.id, status, getNotes(), user.uid, userDoc.displayName);
        Toast.success(`Report marked as ${status}`);
      } catch (error) {
        Toast.error('Failed to update report');
      }
    };

    const reviewBtn = detailView.querySelector('#btn-review');
    if (reviewBtn) reviewBtn.addEventListener('click', () => updateStatus('in_review'));
    
    const resolveBtn = detailView.querySelector('#btn-resolve');
    if (resolveBtn) resolveBtn.addEventListener('click', () => updateStatus('resolved'));
    
    const dismissBtn = detailView.querySelector('#btn-dismiss');
    if (dismissBtn) dismissBtn.addEventListener('click', () => updateStatus('dismissed'));
  };

  const unsubscribe = ReportsService.subscribeToAllReports((reports) => {
    currentReports = reports;
    const filter = container.querySelector('#filter-status').value;
    renderList(filter);
    
    // Update detail view if open
    if (selectedReportId) {
      const updated = currentReports.find(r => r.id === selectedReportId);
      if (updated) renderDetail(updated);
    }
  });

  // Filter handler
  setTimeout(() => {
    const filterSelect = container.querySelector('#filter-status');
    filterSelect.addEventListener('change', (e) => {
      renderList(e.target.value);
    });
  }, 0);

  const cleanup = () => {
    unsubscribe();
    window.removeEventListener('hashchange', cleanup);
  };
  window.addEventListener('hashchange', cleanup);

  return container;
};
