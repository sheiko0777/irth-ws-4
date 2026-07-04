/**
 * section-reveal.js
 *
 * Lightweight, dependency-free scroll-reveal utility for IRTH.
 * Staggered fade + translateY reveal on elements marked with
 * [data-animate-on-scroll], respecting prefers-reduced-motion.
 *
 * Usage (Liquid):
 *   <div data-animate-on-scroll data-reveal-group="hero" data-reveal-index="0">...</div>
 *
 * - data-reveal-group groups elements that should stagger together
 *   (e.g. all cards in one product grid row).
 * - data-reveal-index (optional) sets the stagger order within a group;
 *   defaults to DOM order among matched elements in that group.
 * - data-reveal-stagger-ms (optional, on the group's first element or
 *   overridden per-element) controls per-item delay; defaults to 50ms,
 *   matching the "40-60ms per card" guidance for product grids.
 */

(() => {
  const SELECTOR = '[data-animate-on-scroll]';
  const DEFAULT_STAGGER_MS = 50;
  const DEFAULT_DURATION_MS = 320;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  const revealElement = (element, delayMs) => {
    element.style.transitionDelay = `${delayMs}ms`;
    element.setAttribute('data-reveal-visible', 'true');
  };

  const revealAllInstantly = (elements) => {
    elements.forEach((element) => {
      element.removeAttribute('data-animate-on-scroll');
      element.style.transitionDelay = '';
      element.removeAttribute('data-reveal-visible');
    });
  };

  const groupIndexCounters = new Map();

  const nextIndexForGroup = (group) => {
    const current = groupIndexCounters.get(group) || 0;
    groupIndexCounters.set(group, current + 1);
    return current;
  };

  const init = () => {
    const elements = Array.from(document.querySelectorAll(SELECTOR));

    if (elements.length === 0) return;

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      revealAllInstantly(elements);
      return;
    }

    elements.forEach((element) => {
      element.style.setProperty(
        '--reveal-duration',
        `${DEFAULT_DURATION_MS}ms`
      );
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target;
          const group = element.getAttribute('data-reveal-group') || 'default';
          const staggerMs = Number(
            element.getAttribute('data-reveal-stagger-ms') ||
              DEFAULT_STAGGER_MS
          );
          const explicitIndex = element.getAttribute('data-reveal-index');
          const index =
            explicitIndex !== null
              ? Number(explicitIndex)
              : nextIndexForGroup(group);

          revealElement(element, index * staggerMs);
          obs.unobserve(element);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
