import { AuthService } from '../../services/auth.js';
import { ReportsService } from '../../services/reports.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { createStatusBadge } from '../../components/status-badge.js';
import { createEmptyState } from '../../components/empty-state.js';
import { Modal } from '../../components/modal.js';
import { auth } from '../../firebase.js';
import { Toast } from '../../components/toast.js';

export const renderCustomerReports = async () => {
  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  container.appendChild(createSidebar('customer', '/customer/reports'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl flex-col h-full';
  content.style.maxWidth = '1000px';
  content.style.margin = '0 auto';
  
  content.innerHTML = `
    <div class="page-header flex justify-between items-center mb-xl">
      <div>
        <h1 class="page-title">My Reports</h1>
        <p class="page-subtitle">Submit and track your support requests</p>
      </div>
      <button class="btn btn-primary" id="new-report-btn">
        <i data-lucide="plus"></i> New Report
      </button>
    </div>

    <div class="card p-0 hidden" id="new-report-form" style="margin-bottom: var(--space-xl)">
      <div class="card-header border-b border-light p-lg">
        <h3 class="card-title">Submit a New Report</h3>
      </div>
      <div class="card-body p-lg">
        <form id="submit-report-form">
          <div class="form-group mb-md">
            <label class="form-label">Subject</label>
            <input type="text" id="report-subject" class="form-input" placeholder="What is this about?" required />
          </div>
          <div class="form-group mb-md">
            <label class="form-label">Related Job ID (Optional)</label>
            <input type="text" id="report-jobid" class="form-input" placeholder="e.g. jHk92nSm..." />
          </div>
          <div class="form-group mb-md">
            <label class="form-label">Description</label>
            <textarea id="report-desc" class="form-input" rows="4" placeholder="Please describe your issue in detail..." required></textarea>
          </div>
          <div class="flex justify-end gap-sm mt-lg">
            <button type="button" class="btn btn-ghost" id="cancel-report-btn">Cancel</button>
            <button type="submit" class="btn btn-primary" id="save-report-btn">Submit Report</button>
          </div>
        </form>
      </div>
    </div>

    <div id="reports-container" class="report-list stagger-children">
      <div class="spinner"></div>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  // Form toggle
  const newReportBtn = container.querySelector('#new-report-btn');
  const cancelReportBtn = container.querySelector('#cancel-report-btn');
  const reportForm = container.querySelector('#new-report-form');
  const form = container.querySelector('#submit-report-form');
  const saveBtn = container.querySelector('#save-report-btn');

  newReportBtn.addEventListener('click', () => {
    reportForm.classList.remove('hidden');
    newReportBtn.style.display = 'none';
  });

  cancelReportBtn.addEventListener('click', () => {
    reportForm.classList.add('hidden');
    newReportBtn.style.display = 'flex';
    form.reset();
  });

  // Submit report
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject = form.querySelector('#report-subject').value.trim();
    const jobId = form.querySelector('#report-jobid').value.trim();
    const description = form.querySelector('#report-desc').value.trim();

    if (!subject || !description) return;

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px"></span>';

    try {
      await ReportsService.createReport({
        reporterId: user.uid,
        reporterName: userDoc.displayName,
        reporterEmail: userDoc.email,
        reporterRole: 'customer',
        subject,
        description,
        jobId: jobId || null,
        priority: 'medium'
      });
      
      Toast.success('Report submitted successfully');
      form.reset();
      reportForm.classList.add('hidden');
      newReportBtn.style.display = 'flex';
    } catch (error) {
      Toast.error('Failed to submit report');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Submit Report';
    }
  });

  // Render a report item
  const createReportItem = (report) => {
    const el = document.createElement('div');
    el.className = 'report-card';
    
    const dateStr = report.createdAt 
      ? new Intl.DateTimeFormat('en-EG', { month: 'short', day: 'numeric', year: 'numeric' }).format(report.createdAt.toDate())
      : '';

    let adminResponseHtml = '';
    if (report.adminResponse) {
      adminResponseHtml = `
        <div class="mt-md p-md bg-grey-50 rounded border border-light">
          <div class="text-caption text-secondary mb-xs font-bold">Admin Response</div>
          <div class="text-body-sm">${report.adminResponse}</div>
        </div>
      `;
    }

    el.innerHTML = `
      <div class="report-card__priority report-card__priority--${report.priority}"></div>
      <div class="report-card__content">
        <div class="report-card__title">
          ${report.subject}
        </div>
        <div class="report-card__meta">
          <span><i data-lucide="clock" style="width:12px;height:12px"></i> ${dateStr}</span>
          ${report.jobId ? `<span><i data-lucide="package" style="width:12px;height:12px"></i> Job: ${report.jobId.substring(0,8)}</span>` : ''}
        </div>
      </div>
      <div class="report-card__status">
        ${createStatusBadge(report.status)}
      </div>
    `;

    el.addEventListener('click', () => {
      Modal.show({
        title: 'Report Details',
        content: `
          <div class="flex flex-col gap-sm">
            <div class="flex justify-between items-center mb-md">
              <h4 class="font-bold text-lg">${report.subject}</h4>
              ${createStatusBadge(report.status)}
            </div>
            <div class="text-secondary text-sm mb-md">Submitted on ${dateStr}</div>
            
            <div class="p-md bg-grey-50 rounded border border-light text-body whitespace-pre-wrap">${report.description}</div>
            
            ${adminResponseHtml}
          </div>
        `,
        actions: [
          { label: 'Close', onClick: (close) => close() }
        ]
      });
    });

    return el;
  };

  // Subscribe to reports
  const unsubscribe = ReportsService.subscribeToUserReports(user.uid, (reports) => {
    const container = document.getElementById('reports-container');
    if (!container) return; // if unmounted

    container.innerHTML = '';
    
    if (reports.length === 0) {
      container.innerHTML = createEmptyState('No Reports', 'You have not submitted any reports yet.', 'message-square');
    } else {
      reports.forEach(report => {
        container.appendChild(createReportItem(report));
      });
    }
    
    if (window.lucide) window.lucide.createIcons({ root: container });
  });

  const cleanup = () => {
    unsubscribe();
    window.removeEventListener('hashchange', cleanup);
  };
  window.addEventListener('hashchange', cleanup);

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons({ root: container });
  }, 0);

  return container;
};
