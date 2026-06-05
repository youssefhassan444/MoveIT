import { AuthService } from '../../services/auth.js';
import { JobsService } from '../../services/jobs.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { auth } from '../../firebase.js';

export const renderCustomerHome = async () => {
  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  container.appendChild(createSidebar('customer', '/customer'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl stagger-children';
  
  content.innerHTML = `
    <div class="welcome-banner">
      <div class="welcome-banner__text">
        <div class="welcome-banner__greeting">Good morning,</div>
        <div class="welcome-banner__name">${userDoc.displayName}</div>
        <div class="welcome-banner__subtitle">What would you like to deliver today?</div>
      </div>
    </div>

    <div class="dashboard-grid dashboard-grid--wide mt-xl">
      <!-- Wallet & Promo -->
      <div class="flex flex-col gap-lg">
        <div class="wallet-card">
          <div class="wallet-card__label">PayIt Balance</div>
          <div class="wallet-card__balance">0.00 <span class="wallet-card__currency">EGP</span></div>
          <div class="wallet-card__actions">
            <a href="#/customer/wallet" class="wallet-action-btn">
              <i data-lucide="plus"></i> Top Up
            </a>
            <a href="#/customer/wallet" class="wallet-action-btn">
              <i data-lucide="credit-card"></i> Manage
            </a>
          </div>
        </div>

        <div class="card card-gradient-blue card-interactive" onclick="alert('Please download the MoveIt mobile app to post jobs and access all features.')">
          <div class="card-body">
            <h3 class="text-title mb-sm">MoveIt Business</h3>
            <p class="text-body-sm opacity-80 mb-md">Need regular logistics for your store? Apply for a business account.</p>
            <button class="btn btn-sm bg-white text-brand-sky-blue w-full">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons({ root: container });
  }, 0);

  return container;
};
