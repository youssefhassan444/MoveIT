export const createLoader = (size = 'default') => {
  const spinnerClass = size === 'large' ? 'spinner spinner-lg' : 'spinner';
  return `<div class="${spinnerClass}"></div>`;
};

export const createLoadingOverlay = (message = 'Loading...') => {
  return `
    <div class="loading-overlay">
      <div class="spinner spinner-lg"></div>
      <div class="text-body-sm">${message}</div>
    </div>
  `;
};

export const createSkeletonCard = () => {
  return `<div class="skeleton skeleton-card"></div>`;
};

export const createSkeletonList = (count = 3) => {
  return Array(count).fill(createSkeletonCard()).join('');
};
