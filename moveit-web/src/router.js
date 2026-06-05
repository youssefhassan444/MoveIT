// Simple client-side hash router
import { auth } from './firebase.js';

class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.appRoot = document.getElementById('app');
    
    // Listen to hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  addRoute(path, component, guard = null) {
    // path can be a string or a regex
    const isRegex = path instanceof RegExp;
    this.routes.push({ path, component, guard, isRegex });
  }

  async handleRoute() {
    // Remove loading overlay if present
    const loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('fade-out');

    const hash = window.location.hash.slice(1) || '/';
    const cleanPath = hash.split('?')[0];

    // Find matching route
    let match = null;
    let params = {};

    for (const route of this.routes) {
      if (route.isRegex) {
        const result = cleanPath.match(route.path);
        if (result) {
          match = route;
          params = result.groups || {};
          break;
        }
      } else if (route.path === cleanPath) {
        match = route;
        break;
      }
    }

    if (!match) {
      this.navigate('/customer'); // default fallback
      return;
    }

    // Check guards
    if (match.guard) {
      const canAccess = await match.guard();
      if (!canAccess) return; // guard handles redirect
    }

    // Render component
    try {
      const view = await match.component(params);
      this.appRoot.innerHTML = '';
      this.appRoot.appendChild(view);
      
      // Re-initialize Lucide icons for new content
      if (window.lucide) {
        window.lucide.createIcons();
      }
    } catch (error) {
      console.error('Routing error:', error);
      this.appRoot.innerHTML = `<div class="p-xl text-center"><h2 class="text-headline">Error loading page</h2><p class="text-body">${error.message}</p></div>`;
    }
  }

  navigate(path) {
    window.location.hash = path;
  }
}

export const router = new Router();

// Guards
export const requireAuth = async () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      if (!user) {
        router.navigate('/login');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export const requireGuest = async () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      if (user) {
        // We'll need to check role to know where to redirect, 
        // but for now redirect to a loader that checks role
        router.navigate('/dashboard'); 
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
