export class Modal {
  static show({ title, content, actions = [] }) {
    const root = document.getElementById('modal-root');
    if (!root) return null;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    
    let footerHtml = '';
    if (actions.length > 0) {
      footerHtml = `
        <div class="modal__footer">
          ${actions.map((action, i) => `
            <button class="btn ${action.primary ? 'btn-primary' : 'btn-ghost'}" id="modal-action-${i}">
              ${action.label}
            </button>
          `).join('')}
        </div>
      `;
    }

    backdrop.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">${title}</h3>
          <button class="btn-icon" id="modal-close"><i data-lucide="x"></i></button>
        </div>
        <div class="modal__body">
          ${typeof content === 'string' ? content : ''}
        </div>
        ${footerHtml}
      </div>
    `;

    if (typeof content !== 'string') {
      backdrop.querySelector('.modal__body').appendChild(content);
    }

    root.appendChild(backdrop);
    if (window.lucide) window.lucide.createIcons({ root: backdrop });

    const close = () => {
      backdrop.style.animation = 'fadeOut 0.2s ease forwards';
      backdrop.querySelector('.modal').style.animation = 'scaleOut 0.2s ease forwards';
      setTimeout(() => {
        if (backdrop.parentNode) root.removeChild(backdrop);
      }, 200);
    };

    backdrop.querySelector('#modal-close').addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });

    actions.forEach((action, i) => {
      const btn = backdrop.querySelector(`#modal-action-${i}`);
      btn.addEventListener('click', () => {
        action.onClick(close);
      });
    });

    return { close };
  }
}
