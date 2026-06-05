export const createEmptyState = (title, message, icon = 'inbox') => {
  return `
    <div class="empty-state">
      <i data-lucide="${icon}" class="empty-state__icon"></i>
      <h3 class="empty-state__title">${title}</h3>
      <p class="empty-state__text">${message}</p>
    </div>
  `;
};
