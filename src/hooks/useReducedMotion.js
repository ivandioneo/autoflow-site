import { useState, useEffect } from 'react';

/**
 * Returns true if the user has requested reduced motion.
 * Used to pause Three.js animations, film-strip autoplay,
 * and mechanical counter animations site-wide.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
