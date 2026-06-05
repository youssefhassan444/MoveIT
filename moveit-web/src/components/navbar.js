import { auth } from '../firebase.js';

export const createNavbar = (userDoc) => {
  const isCustomer = userDoc?.role === 'customer';
  const isAdmin = userDoc?.role === 'admin';
  
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  
  const initial = userDoc?.displayName ? userDoc.displayName.charAt(0).toUpperCase() : 'U';

  nav.innerHTML = `
    <div class="flex items-center gap-md">
      <button class="mobile-menu-btn" id="mobile-menu-toggle">
        <i data-lucide="menu"></i>
      </button>
      <a href="#/${isCustomer ? 'customer' : 'admin'}" class="navbar__brand">
        <span class="navbar__title">Move<span style="color: var(--brand-orange)">It</span></span>
      </a>
    </div>

    <div class="navbar__actions">
      ${isCustomer ? `
        <a href="#/customer/post-job" class="btn btn-sm btn-primary hidden-mobile">
          <i data-lucide="plus"></i> Post Job
        </a>
      ` : ''}
      
      <div class="navbar__user" id="user-menu-toggle">
        <div class="navbar__avatar ${isAdmin ? 'bg-navy' : ''}">${initial}</div>
        <span class="navbar__username">${userDoc?.displayName || 'User'}</span>
        <i data-lucide="chevron-down" style="width: 16px; height: 16px"></i>
        
        <div class="navbar__dropdown hidden" id="user-dropdown">
          <div class="p-sm px-md text-caption">Signed in as <br/><strong>${userDoc?.email}</strong></div>
          <div class="navbar__dropdown-divider"></div>
          ${isCustomer ? `
            <a href="#/customer/profile" class="navbar__dropdown-item">
              <i data-lucide="user"></i> Profile
            </a>
            <a href="#/customer/settings" class="navbar__dropdown-item">
              <i data-lucide="settings"></i> Settings
            </a>
          ` : ''}
          <div class="navbar__dropdown-divider"></div>
          <button class="navbar__dropdown-item navbar__dropdown-item--danger" onclick="window.logout()">
            <i data-lucide="log-out"></i> Logout
          </button>
        </div>
      </div>
    </div>
  `;

  // Toggle dropdown
  const toggle = nav.querySelector('#user-menu-toggle');
  const dropdown = nav.querySelector('#user-dropdown');
  
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  // Toggle mobile sidebar
  const mobileToggle = nav.querySelector('#mobile-menu-toggle');
  mobileToggle?.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.toggle('open');
  });

  return nav;
};
