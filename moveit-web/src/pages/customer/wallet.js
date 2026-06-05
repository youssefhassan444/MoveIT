import { AuthService } from '../../services/auth.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { auth } from '../../firebase.js';
import { Toast } from '../../components/toast.js';

export const renderCustomerWallet = async () => {
  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  container.appendChild(createSidebar('customer', '/customer/wallet'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl stagger-children';
  content.style.maxWidth = '800px';
  content.style.margin = '0 auto';
  
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">PayIt Wallet</h1>
      <p class="page-subtitle">Manage your payment methods and balance</p>
    </div>

    <div class="wallet-card mb-xl">
      <div class="wallet-card__label">Current Balance</div>
      <div class="wallet-card__balance">0.00 <span class="wallet-card__currency">EGP</span></div>
      <div class="wallet-card__actions">
        <button class="wallet-action-btn" id="topup-btn">
          <i data-lucide="plus"></i> Top Up
        </button>
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-header">
        <h3 class="card-title">Payment Methods</h3>
        <button class="btn btn-sm btn-ghost" id="add-card-btn">
          <i data-lucide="plus"></i> Add Card
        </button>
      </div>
      <div class="card-body">
        <div class="flex flex-col gap-sm">
          <div class="p-md border rounded flex items-center justify-between" style="border-color: var(--brand-sky-blue); background: rgba(var(--brand-sky-blue-rgb), 0.05)">
            <div class="flex items-center gap-md">
              <i data-lucide="banknote" class="text-brand-sky-blue"></i>
              <div>
                <div class="font-bold">Cash on Delivery</div>
                <div class="text-caption">Default payment method</div>
              </div>
            </div>
            <i data-lucide="check-circle" class="text-brand-sky-blue"></i>
          </div>
          
          <div class="p-md border rounded flex items-center justify-between text-secondary">
            <div class="flex items-center gap-md">
              <i data-lucide="credit-card"></i>
              <div>
                <div class="font-bold">Visa •••• 4242</div>
                <div class="text-caption">Expires 12/28</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  // Add event listeners
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons({ root: container });

    container.querySelector('#topup-btn').addEventListener('click', () => {
      Toast.info('Top up functionality coming soon.');
    });

    container.querySelector('#add-card-btn').addEventListener('click', () => {
      Toast.info('Card addition coming soon.');
    });
  }, 0);

  return container;
};
