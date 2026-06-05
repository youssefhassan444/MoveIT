export class Toast {
  static show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    let icon = '';
    switch(type) {
      case 'success': icon = '<i data-lucide="check-circle"></i>'; break;
      case 'error': icon = '<i data-lucide="alert-circle"></i>'; break;
      case 'warning': icon = '<i data-lucide="alert-triangle"></i>'; break;
      default: icon = '<i data-lucide="info"></i>'; break;
    }

    toast.innerHTML = `
      <div class="toast__icon">${icon}</div>
      <div class="toast__message">${message}</div>
      <button class="toast__close"><i data-lucide="x"></i></button>
    `;

    container.appendChild(toast);
    
    // Initialize icons
    if (window.lucide) {
      window.lucide.createIcons({ root: toast });
    }

    // Setup removal
    const closeBtn = toast.querySelector('.toast__close');
    let timeout;

    const remove = () => {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300); // match animation duration
    };

    closeBtn.addEventListener('click', () => {
      clearTimeout(timeout);
      remove();
    });

    timeout = setTimeout(remove, duration);
  }

  static success(message, duration) { this.show(message, 'success', duration); }
  static error(message, duration) { this.show(message, 'error', duration); }
  static warning(message, duration) { this.show(message, 'warning', duration); }
  static info(message, duration) { this.show(message, 'info', duration); }
}
