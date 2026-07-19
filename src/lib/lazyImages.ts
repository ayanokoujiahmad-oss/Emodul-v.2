// ──────────────────────────────────────────────
// SiberCerdas – Global Lazy Loading for Images
// ──────────────────────────────────────────────
// Automatically adds loading="lazy" and decoding="async" to all <img>
// elements that don't already have them. Uses MutationObserver to catch
// React-rendered images after initial page load.
// ──────────────────────────────────────────────

function applyLazyLoading(img: HTMLImageElement) {
  // Skip images that already have loading attribute set
  if (img.getAttribute('loading')) return;
  // Skip tiny inline images (icons, avatars < 48px)
  if (img.naturalWidth > 0 && img.naturalWidth < 48) return;

  img.loading = 'lazy';
  img.decoding = 'async';
}

// Apply to all existing images
function scanExistingImages() {
  document.querySelectorAll<HTMLImageElement>('img').forEach(applyLazyLoading);
}

// Watch for new images added to the DOM (React renders)
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node instanceof HTMLImageElement) {
        applyLazyLoading(node);
      }
      if (node instanceof HTMLElement) {
        node.querySelectorAll<HTMLImageElement>('img').forEach(applyLazyLoading);
      }
    }
  }
});

// Start observing after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    scanExistingImages();
    observer.observe(document.body, { childList: true, subtree: true });
  });
} else {
  scanExistingImages();
  observer.observe(document.body, { childList: true, subtree: true });
}

export {};
