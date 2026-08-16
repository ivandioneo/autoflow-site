import { useRef, useEffect, useState } from 'react';
import { HOW_IT_WORKS } from '../content';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * HowItWorks — Horizontal scroll-driven film-strip timeline.
 * Desktop: scroll horizontally through steps.
 * Mobile: swipeable card carousel.
 * Reduced motion: static grid layout.
 */
export default function HowItWorks() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  // Scroll-driven step highlighting
  useEffect(() => {
    if (reduced || !trackRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index));
          }
        });
      },
      { root: trackRef.current, threshold: 0.6 }
    );
    const cards = trackRef.current.querySelectorAll('[data-index]');
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [reduced]);

  if (reduced) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
        {HOW_IT_WORKS.map((s) => <StepCard key={s.step} step={s} active />)}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Progress bar */}
      <div style={{
        display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28,
      }}>
        {HOW_IT_WORKS.map((_, i) => (
          <div key={i} style={{
            height: 3, borderRadius: 2, flex: 1, maxWidth: 48,
            background: i <= active ? '#14B8A6' : 'rgba(255,255,255,0.1)',
            transition: 'background 0.4s ease',
          }} />
        ))}
      </div>

      {/* Film strip track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 20,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '4px 0 16px',
        }}
      >
        {HOW_IT_WORKS.map((s, i) => (
          <div
            key={s.step}
            data-index={i}
            style={{
              scrollSnapAlign: 'start',
              flexShrink: 0,
              width: 'clamp(240px, 60vw, 280px)',
            }}
          >
            <StepCard step={s} active={i === active} />
          </div>
        ))}
      </div>

      <style>{`.how-track::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}

function StepCard({ step, active }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 18,
      padding: '32px 24px',
      border: `1px solid ${active ? step.color + '30' : '#E2E8F0'}`,
      boxShadow: active
        ? `0 8px 32px ${step.color}14, 0 1px 0 rgba(255,255,255,0.8) inset`
        : '0 2px 8px rgba(0,0,0,0.04)',
      transform: active ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Step number — large background numeral */}
      <div style={{
        position: 'absolute',
        top: -10,
        right: 16,
        fontFamily: "'Boska', Georgia, serif",
        fontSize: 96,
        fontWeight: 900,
        color: step.color,
        opacity: 0.06,
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>{step.step}</div>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: step.color + '14',
        border: `1px solid ${step.color}30`,
        borderRadius: 20,
        padding: '4px 12px',
        marginBottom: 16,
      }}>
        <span style={{ fontFamily: "'Boska', Georgia, serif", color: step.color, fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
          STEP {step.step}
        </span>
      </div>

      <div style={{
        fontFamily: "'Boska', Georgia, serif",
        fontWeight: 700,
        fontSize: 18,
        color: '#0C0A09',
        marginBottom: 8,
        lineHeight: 1.2,
      }}>{step.title}</div>

      <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{step.desc}</div>
    </div>
  );
}
