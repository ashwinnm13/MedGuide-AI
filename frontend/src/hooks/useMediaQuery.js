/**
 * MedGuide AI — useMediaQuery Hook
 * Reactive media query matching for responsive layout decisions.
 */

import { useState, useEffect } from 'react';

/**
 * @param {string} query - CSS media query string
 * @returns {boolean} Whether the media query currently matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// ─── Convenience Presets ────────────────────────────────────────────

/** True when viewport ≤ 768px (mobile) */
export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)');
}

/** True when viewport ≤ 1024px (tablet or smaller) */
export function useIsTablet() {
  return useMediaQuery('(max-width: 1024px)');
}

/** True when viewport ≥ 1280px (large desktop) */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 1280px)');
}
