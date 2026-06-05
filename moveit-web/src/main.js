import { auth } from './firebase.js';
import { AuthService } from './services/auth.js';
import { router, requireAuth, requireGuest } from './router.js';

// Import pages
import { renderLogin } from './pages/auth/login.js';
import { renderSignup } from './pages/auth/signup.js';
import { renderCustomerHome } from './pages/customer/home.js';
import { renderCustomerWallet } from './pages/customer/wallet.js';
import { renderCustomerProfile } from './pages/customer/profile.js';
import { renderCustomerSettings } from './pages/customer/settings.js';
import { renderCustomerJobs } from './pages/customer/jobs.js';
import { renderCustomerJobDetail } from './pages/customer/job-detail.js';
import { renderCustomerReports } from './pages/customer/reports.js';

import { renderAdminDashboard } from './pages/admin/dashboard.js';
import { renderAdminReports } from './pages/admin/reports.js';
import { renderAdminJobs } from './pages/admin/jobs.js';
import { renderAdminUsers } from './pages/admin/users.js';
import { renderLanding } from './pages/landing.js';

// Define Routes
router.addRoute('/', renderLanding);

// Auth Routes
// Auth Routes
router.addRoute('/login', renderLogin, requireGuest);
router.addRoute('/signup', renderSignup, requireGuest);

// Dashboard loader (temporary until customer/admin pages are built)
router.addRoute('/dashboard', async () => {
  const user = auth.currentUser;
  if (!user) return document.createElement('div');
  
  const userDoc = await AuthService.getUserDoc(user.uid);
  if (userDoc?.role === 'admin') {
    router.navigate('/admin');
  } else {
    router.navigate('/customer');
  }
  return document.createElement('div');
});

// Customer Routes
router.addRoute('/customer', renderCustomerHome, requireAuth);
router.addRoute('/customer/wallet', renderCustomerWallet, requireAuth);
router.addRoute('/customer/profile', renderCustomerProfile, requireAuth);
router.addRoute('/customer/settings', renderCustomerSettings, requireAuth);
router.addRoute('/customer/jobs', () => renderCustomerJobs({}, false), requireAuth);
router.addRoute('/customer/history', () => renderCustomerJobs({}, true), requireAuth);
router.addRoute('/customer/reports', renderCustomerReports, requireAuth);
router.addRoute(/(?:\/customer\/job\/)(?<id>[a-zA-Z0-9_-]+)/, renderCustomerJobDetail, requireAuth);

// Admin Routes
router.addRoute('/admin', renderAdminDashboard, requireAuth);
router.addRoute('/admin/reports', renderAdminReports, requireAuth);
router.addRoute('/admin/jobs', renderAdminJobs, requireAuth);
router.addRoute('/admin/users', renderAdminUsers, requireAuth);

// Global logout helper for early testing
window.logout = async () => {
  await AuthService.logout();
  router.navigate('/login');
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Wait for initial auth state to resolve before first route
  const unsubscribe = auth.onAuthStateChanged(user => {
    unsubscribe();
    router.handleRoute();
  });
});
