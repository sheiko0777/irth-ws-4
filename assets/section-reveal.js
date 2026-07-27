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
  // Keeps the tail of a long grid from waiting seconds to appear.
  const MAX_DELAY_MS = 300;

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

  /**
   * Resolves the stagger position for an element.
   *
   * Elements sharing a group name (e.g. every product card on the page) must not
   * share one running counter: it never resets, so cards further down the page
   * inherit ever-larger delays. Instead the index is resolved within the nearest
   * list/grid, so each row restarts its stagger at zero.
   *
   * @param {Element} element
   * @param {string} group
   * @returns {number}
   */
  const peersWithin = (root, group) =>
    Array.from(root.querySelectorAll(SELECTOR)).filter(
      (peer) => (peer.getAttribute('data-reveal-group') || 'default') === group
    );

  const resolveIndex = (element, group) => {
    const explicitIndex = element.getAttribute('data-reveal-index');
    if (explicitIndex !== null) return Number(explicitIndex);

    const explicitScope = element.closest('[data-reveal-scope]');
    if (explicitScope) {
      const index = peersWithin(explicitScope, group).indexOf(element);
      if (index !== -1) return index;
    }

    // Climb until we hit the ancestor that actually groups this element with its
    // siblings (markup varies: `.resource-list` of divs here, `ul > li` elsewhere).
    // Bounded by the enclosing section so a new section restarts at zero rather
    // than continuing the previous section's count.
    const boundary = element.closest('.shopify-section');
    let node = element.parentElement;

    while (node) {
      const peers = peersWithin(node, group);
      if (peers.length > 1) {
        const index = peers.indexOf(element);
        if (index !== -1) return index;
      }
      if (node === boundary) break;
      node = node.parentElement;
    }

    return nextIndexForGroup(group);
  };

  // Tells the inline bootstrap's watchdog the reveal is running, so it leaves the
  // [data-reveal-ready] gate armed. Anything that returns before an observer is
  // actually watching must disarm the gate instead, or the content stays hidden.
  const disarmGate = () =>
    document.documentElement.removeAttribute('data-reveal-ready');

  const init = () => {
    window.__irthRevealInit = true;

    const elements = Array.from(document.querySelectorAll(SELECTOR));

    if (elements.length === 0) {
      disarmGate();
      return;
    }

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      revealAllInstantly(elements);
      disarmGate();
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
          const index = resolveIndex(element, group);

          revealElement(element, Math.min(index * staggerMs, MAX_DELAY_MS));
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
