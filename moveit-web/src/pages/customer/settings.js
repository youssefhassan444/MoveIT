import { AuthService } from '../../services/auth.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { auth } from '../../firebase.js';

export const renderCustomerSettings = async () => {
  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  container.appendChild(createSidebar('customer', '/customer/settings'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl stagger-children';
  content.style.maxWidth = '800px';
  content.style.margin = '0 auto';
  
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your application preferences</p>
    </div>

    <div class="settings-section">
      <div class="settings-section__title">Notifications</div>
      
      <div class="settings-item">
        <div>
          <div class="font-bold mb-xs">Push Notifications</div>
          <div class="text-caption text-secondary">Receive updates about your delivery status</div>
        </div>
        <label class="switch">
          <input type="checkbox" checked>
          <span class="slider round"></span>
        </label>
      </div>

      <div class="settings-item">
        <div>
          <div class="font-bold mb-xs">Email Receipts</div>
          <div class="text-caption text-secondary">Send invoice to email after delivery</div>
        </div>
        <label class="switch">
          <input type="checkbox" checked>
          <span class="slider round"></span>
        </label>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section__title">Language & Region</div>
      
      <div class="settings-item">
        <div>
          <div class="font-bold mb-xs">Language</div>
        </div>
        <select class="form-input" style="width: auto">
          <option value="en">English</option>
          <option value="ar">العربية (Arabic)</option>
        </select>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section__title">Danger Zone</div>
      
      <div class="settings-item">
        <div>
          <div class="font-bold text-error mb-xs">Delete Account</div>
          <div class="text-caption text-secondary">Permanently delete your account and all data</div>
        </div>
        <button class="btn btn-sm btn-ghost" style="color: var(--brand-error); border-color: var(--brand-error)" id="delete-account-btn">
          Delete Account
        </button>
      </div>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons({ root: container });

    container.querySelector('#delete-account-btn').addEventListener('click', () => {
      if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
        alert('Account deletion requires contacting support in this version.');
      }
    });
  }, 0);

  return container;
};
