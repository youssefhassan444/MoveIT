export const createSidebar = (role, currentPath) => {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  
  const isCustomer = role === 'customer';
  
  const customerLinks = [
    { path: '/customer', icon: 'home', label: 'Dashboard' },
    { path: '/customer/jobs', icon: 'list', label: 'Active Jobs' },
    { path: '/customer/history', icon: 'clock', label: 'History' },
    { path: '/customer/reports', icon: 'message-square', label: 'My Reports' },
    { path: '/customer/wallet', icon: 'wallet', label: 'Wallet' },
    { path: '/customer/profile', icon: 'user', label: 'Profile' },
    { path: '/', icon: 'globe', label: 'MoveIt Website' }
  ];

  const adminLinks = [
    { path: '/admin', icon: 'layout-dashboard', label: 'Overview' },
    { path: '/admin/reports', icon: 'flag', label: 'Reports' },
    { path: '/admin/jobs', icon: 'package', label: 'Jobs' },
    { path: '/admin/users', icon: 'users', label: 'Users' },
    { path: '/', icon: 'globe', label: 'MoveIt Website' }
  ];

  const links = isCustomer ? customerLinks : adminLinks;

  let linksHtml = '';
  links.forEach(link => {
    // Exact match for root dashboard, startsWith for subpages
    const isActive = link.path === `/${role}` 
      ? currentPath === link.path 
      : currentPath.startsWith(link.path);
      
    linksHtml += `
      <a href="#${link.path}" class="sidebar__link ${isActive ? 'active' : ''}">
        <i data-lucide="${link.icon}"></i>
        <span>${link.label}</span>
      </a>
    `;
  });

  sidebar.innerHTML = `
    <div class="sidebar__nav">
      <div class="sidebar__section-title">Menu</div>
      ${linksHtml}
    </div>
    <div class="sidebar__footer">
      <div class="text-caption text-center">MoveIt v1.0.0</div>
    </div>
  `;

  // Close sidebar on mobile when a link is clicked
  sidebar.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
      }
    });
  });

  return sidebar;
};
