import { AuthService } from '../../services/auth.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { auth, db } from '../../firebase.js';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';

export const renderAdminUsers = async () => {
  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  container.appendChild(createSidebar('admin', '/admin/users'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl flex-col h-full';
  content.style.maxWidth = '1000px';
  content.style.margin = '0 auto';
  
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Users Directory</h1>
      <p class="page-subtitle">View customers, drivers, and admins</p>
    </div>

    <div class="card p-0" style="overflow-x: auto;">
      <table class="w-full text-left">
        <thead class="bg-grey-50 border-b border-light text-sm text-secondary">
          <tr>
            <th class="p-md font-bold">User</th>
            <th class="p-md font-bold">Role</th>
            <th class="p-md font-bold">Joined</th>
            <th class="p-md font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody id="users-table-body">
          <tr><td colspan="4" class="p-xl text-center"><div class="spinner mx-auto"></div></td></tr>
        </tbody>
      </table>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  const loadUsers = async () => {
    const tbody = container.querySelector('#users-table-body');
    try {
      // In a real app we'd paginate this
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      
      tbody.innerHTML = '';
      
      if (snapshot.empty) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-xl text-center text-secondary">No users found</td></tr>`;
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        const dateStr = data.createdAt ? new Intl.DateTimeFormat('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }).format(data.createdAt.toDate()) : 'Unknown';
        
        let initial = data.displayName ? data.displayName.charAt(0).toUpperCase() : 'U';
        
        tbody.innerHTML += `
          <tr class="border-b border-light hover:bg-grey-50 transition-colors">
            <td class="p-md">
              <div class="user-row">
                <div class="user-row__avatar user-row__avatar--${data.role || 'customer'}">${initial}</div>
                <div class="user-row__info">
                  <div class="user-row__name">${data.displayName || 'No Name'}</div>
                  <div class="user-row__email">${data.email || 'No Email'}</div>
                </div>
              </div>
            </td>
            <td class="p-md">
              <span class="badge badge-${data.role || 'customer'} capitalize">${data.role || 'Customer'}</span>
            </td>
            <td class="p-md text-sm text-secondary">
              ${dateStr}
            </td>
            <td class="p-md text-right">
              <button class="btn btn-sm btn-ghost" onclick="alert('User editing not implemented in prototype')">View</button>
            </td>
          </tr>
        `;
      });
    } catch (error) {
      console.error(error);
      tbody.innerHTML = `<tr><td colspan="4" class="p-xl text-center text-error">Failed to load users</td></tr>`;
    }
  };

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons({ root: container });
    loadUsers();
  }, 0);

  return container;
};
