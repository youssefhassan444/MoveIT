import { AuthService } from '../../services/auth.js';
import { JobsService } from '../../services/jobs.js';
import { ReportsService } from '../../services/reports.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { auth, db } from '../../firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const renderAdminDashboard = async () => {
  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  container.appendChild(createSidebar('admin', '/admin'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl stagger-children';
  
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Admin Overview</h1>
      <p class="page-subtitle">Platform statistics and operations center</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
      <div class="card p-lg">
        <div class="text-caption text-secondary font-bold uppercase tracking-wider mb-xs">Total Users</div>
        <div class="text-headline" id="stat-users"><div class="spinner spinner-sm"></div></div>
      </div>
      <div class="card p-lg">
        <div class="text-caption text-secondary font-bold uppercase tracking-wider mb-xs">Active Jobs</div>
        <div class="text-headline" id="stat-jobs"><div class="spinner spinner-sm"></div></div>
      </div>
      <div class="card p-lg" style="border-left: 4px solid var(--brand-error)">
        <div class="text-caption text-secondary font-bold uppercase tracking-wider mb-xs">Open Reports</div>
        <div class="text-headline text-error" id="stat-reports"><div class="spinner spinner-sm"></div></div>
      </div>
      <div class="card p-lg bg-navy text-white">
        <div class="text-caption font-bold uppercase tracking-wider mb-xs opacity-70">Revenue (MTD)</div>
        <div class="text-headline">-- EGP</div>
      </div>
    </div>

    <div class="admin-dashboard">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        
        <!-- Recent Reports -->
        <div class="admin-widget">
          <div class="admin-widget__header">
            <h3 class="admin-widget__title">Recent Reports</h3>
            <a href="#/admin/reports" class="admin-widget__action">View All</a>
          </div>
          <div class="report-list" id="dashboard-reports">
            <div class="spinner mx-auto my-md"></div>
          </div>
        </div>

        <!-- Recent Jobs -->
        <div class="admin-widget">
          <div class="admin-widget__header">
            <h3 class="admin-widget__title">Live Jobs</h3>
            <a href="#/admin/jobs" class="admin-widget__action">View All</a>
          </div>
          <div class="job-list" id="dashboard-jobs">
            <div class="spinner mx-auto my-md"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  // Load Data
  setTimeout(async () => {
    if (window.lucide) window.lucide.createIcons({ root: container });

    try {
      // 1. Fetch Users Count
      const usersSnap = await getDocs(collection(db, 'users'));
      container.querySelector('#stat-users').textContent = usersSnap.size.toLocaleString();

      // 2. Fetch Jobs
      const allJobs = await JobsService.getAllJobs();
      const activeJobs = allJobs.filter(j => ['pending', 'accepted', 'in_transit'].includes(j.status));
      container.querySelector('#stat-jobs').textContent = activeJobs.length.toLocaleString();

      // Render recent jobs
      const jobsContainer = container.querySelector('#dashboard-jobs');
      jobsContainer.innerHTML = '';
      if (activeJobs.length === 0) {
        jobsContainer.innerHTML = '<div class="p-md text-center text-secondary">No active jobs</div>';
      } else {
        activeJobs.slice(0, 4).forEach(job => {
          jobsContainer.innerHTML += `
            <div class="flex items-center justify-between p-sm border-b border-light">
              <div>
                <div class="font-bold text-sm">${job.vehicleTypeRequired.toUpperCase()}</div>
                <div class="text-xs text-secondary truncate" style="max-width:200px">${job.pickupAddress}</div>
              </div>
              <span class="badge badge-${job.status}">${job.status}</span>
            </div>
          `;
        });
      }

      // 3. Fetch Reports
      ReportsService.subscribeToAllReports((reports) => {
        const openReports = reports.filter(r => r.status === 'pending' || r.status === 'in_review');
        container.querySelector('#stat-reports').textContent = openReports.length.toLocaleString();

        const repContainer = container.querySelector('#dashboard-reports');
        repContainer.innerHTML = '';
        if (openReports.length === 0) {
          repContainer.innerHTML = '<div class="p-md text-center text-secondary">No open reports</div>';
        } else {
          openReports.slice(0, 4).forEach(report => {
            repContainer.innerHTML += `
              <div class="report-card" onclick="window.location.hash='#/admin/reports'">
                <div class="report-card__priority report-card__priority--${report.priority}"></div>
                <div class="report-card__content">
                  <div class="report-card__title">${report.subject}</div>
                  <div class="report-card__meta">From: ${report.reporterEmail}</div>
                </div>
                <span class="badge badge-${report.status}">${report.status}</span>
              </div>
            `;
          });
        }
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }

  }, 0);

  return container;
};
