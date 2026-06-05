import { AuthService } from '../../services/auth.js';
import { JobsService } from '../../services/jobs.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { createJobCard } from '../../components/job-card.js';
import { createEmptyState } from '../../components/empty-state.js';
import { auth } from '../../firebase.js';
import { router } from '../../router.js';

export const renderCustomerJobs = async (params, isHistory = false) => {
  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  const path = isHistory ? '/customer/history' : '/customer/jobs';
  container.appendChild(createSidebar('customer', path));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl flex-col h-full';
  content.style.maxWidth = '1000px';
  content.style.margin = '0 auto';
  
  content.innerHTML = `
    <div class="page-header flex justify-between items-center">
      <div>
        <h1 class="page-title">${isHistory ? 'Job History' : 'Active Jobs'}</h1>
        <p class="page-subtitle">${isHistory ? 'Past deliveries and cancelled jobs' : 'Currently pending and active deliveries'}</p>
      </div>
      ${!isHistory ? `
        <a href="#/customer/post-job" class="btn btn-primary">
          <i data-lucide="plus"></i> New Job
        </a>
      ` : ''}
    </div>

    <div id="jobs-container" class="job-list stagger-children">
      <!-- Jobs will be rendered here -->
      <div class="spinner"></div>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  // Subscribe to jobs
  const unsubscribe = JobsService.subscribeToCustomerJobs(user.uid, (allJobs) => {
    const jobsContainer = container.querySelector('#jobs-container');
    jobsContainer.innerHTML = '';

    // Filter jobs based on page type
    const activeStatuses = ['pending', 'accepted', 'in_transit'];
    const filteredJobs = allJobs.filter(j => 
      isHistory ? !activeStatuses.includes(j.status) : activeStatuses.includes(j.status)
    );

    if (filteredJobs.length === 0) {
      jobsContainer.innerHTML = createEmptyState(
        'No Jobs Found',
        isHistory ? 'You do not have any past jobs yet.' : 'You do not have any active jobs right now.',
        'package'
      );
    } else {
      filteredJobs.forEach(job => {
        const card = createJobCard(job, () => {
          router.navigate(`/customer/job/${job.id}`);
        });
        jobsContainer.appendChild(card);
      });
    }

    if (window.lucide) window.lucide.createIcons({ root: jobsContainer });
  });

  // Cleanup subscription when component unmounts
  // Since we don't have a formal unmount hook in our simple router, 
  // we'll listen for hashchange to clean up
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
