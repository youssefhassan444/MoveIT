import { AuthService } from '../../services/auth.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { auth } from '../../firebase.js';
import { Toast } from '../../components/toast.js';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.js';

export const renderCustomerProfile = async () => {
  const user = auth.currentUser;
  let userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  container.appendChild(createSidebar('customer', '/customer/profile'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  const navbar = createNavbar(userDoc);
  mainContent.appendChild(navbar);

  const content = document.createElement('div');
  content.className = 'p-xl stagger-children';
  content.style.maxWidth = '800px';
  content.style.margin = '0 auto';
  
  const initial = userDoc.displayName ? userDoc.displayName.charAt(0).toUpperCase() : 'U';

  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">My Profile</h1>
    </div>

    <div class="profile-header">
      <div class="profile-avatar">${initial}</div>
      <div class="profile-info">
        <div class="flex items-center gap-sm mb-xs">
          <h2 class="profile-name m-0" id="display-name-text">${userDoc.displayName}</h2>
          <span class="badge badge-customer">Customer</span>
        </div>
        <div class="profile-email">${userDoc.email}</div>
        <button class="btn btn-sm btn-secondary" id="edit-profile-btn">Edit Profile</button>
      </div>
    </div>

    <div class="card" id="edit-form-card" style="display: none; margin-bottom: var(--space-xl)">
      <div class="card-header">
        <h3 class="card-title">Edit Profile</h3>
      </div>
      <div class="card-body">
        <form id="edit-profile-form">
          <div class="form-group mb-md">
            <label class="form-label">Display Name</label>
            <input type="text" id="edit-name" class="form-input" value="${userDoc.displayName}" required />
          </div>
          <div class="form-group mb-md">
            <label class="form-label">Email (Read-only)</label>
            <input type="email" class="form-input" value="${userDoc.email}" disabled />
          </div>
          <div class="flex justify-end gap-sm mt-md">
            <button type="button" class="btn btn-ghost" id="cancel-edit-btn">Cancel</button>
            <button type="submit" class="btn btn-primary" id="save-profile-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

    <h3 class="text-title mb-md">Account Settings</h3>
    <div class="profile-menu">
      <a href="#/customer/wallet" class="profile-menu-item">
        <div class="profile-menu-item__left">
          <div class="profile-menu-item__icon"><i data-lucide="wallet"></i></div>
          <span class="profile-menu-item__label">Wallet & Payments</span>
        </div>
        <i data-lucide="chevron-right" class="profile-menu-item__chevron"></i>
      </a>
      <a href="#/customer/reports" class="profile-menu-item">
        <div class="profile-menu-item__left">
          <div class="profile-menu-item__icon"><i data-lucide="message-square"></i></div>
          <span class="profile-menu-item__label">My Reports</span>
        </div>
        <i data-lucide="chevron-right" class="profile-menu-item__chevron"></i>
      </a>
      <a href="#/customer/settings" class="profile-menu-item">
        <div class="profile-menu-item__left">
          <div class="profile-menu-item__icon"><i data-lucide="settings"></i></div>
          <span class="profile-menu-item__label">Preferences</span>
        </div>
        <i data-lucide="chevron-right" class="profile-menu-item__chevron"></i>
      </a>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  // Event Listeners
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons({ root: container });

    const editBtn = container.querySelector('#edit-profile-btn');
    const cancelBtn = container.querySelector('#cancel-edit-btn');
    const formCard = container.querySelector('#edit-form-card');
    const form = container.querySelector('#edit-profile-form');
    const saveBtn = container.querySelector('#save-profile-btn');
    const nameText = container.querySelector('#display-name-text');

    editBtn.addEventListener('click', () => {
      formCard.style.display = 'block';
      editBtn.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
      formCard.style.display = 'none';
      editBtn.style.display = 'block';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = form.querySelector('#edit-name').value.trim();
      if (!newName) return;

      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px"></span>';

      try {
        await updateDoc(doc(db, 'users', user.uid), {
          displayName: newName
        });
        
        nameText.textContent = newName;
        userDoc.displayName = newName;
        
        // Update navbar avatar/name
        const newInitial = newName.charAt(0).toUpperCase();
        navbar.querySelector('.navbar__avatar').textContent = newInitial;
        navbar.querySelector('.navbar__username').textContent = newName;
        container.querySelector('.profile-avatar').textContent = newInitial;

        Toast.success('Profile updated successfully');
        formCard.style.display = 'none';
        editBtn.style.display = 'block';
      } catch (error) {
        Toast.error('Failed to update profile');
        console.error(error);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      }
    });
  }, 0);

  return container;
};
