import { Suspense, lazy, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Three.js canvas is lazy-loaded — never blocks initial paint.
// The entire chunk (~600KB) only downloads after the hero text
// has already rendered and LCP is recorded.
const ThreeScene = lazy(() => import('./NodeGraphScene'));

/**
 * NodeGraph — Hero background 3D node graph.
 * Renders a static gradient fallback until Three.js loads,
 * or permanently if the user prefers reduced motion.
 */
export default function NodeGraph() {
  const reduced = useReducedMotion();

  if (reduced) {
    return <StaticFallback />;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <Suspense fallback={<StaticFallback />}>
        <ThreeScene />
      </Suspense>
    </div>
  );
}

function StaticFallback() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(13,148,136,0.10) 0%, transparent 70%),'
          + 'radial-gradient(ellipse 50% 40% at 20% 70%, rgba(245,158,11,0.06) 0%, transparent 70%)',
      }}
    />
  );
}
