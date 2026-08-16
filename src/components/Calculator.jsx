import { useState, useEffect, useRef } from 'react';
import { CALCULATOR } from '../content';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * MechanicalNumber — animates a value change with a
 * clip-path vertical wipe (like a split-flap board).
 * Falls back to instant swap when reduced-motion is set.
 */
function MechanicalNumber({ value, prefix = '', suffix = '' }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (value === prev.current) return;
    prev.current = value;
    if (reduced) {
      setDisplay(value);
      return;
    }
    setFlipping(true);
    const t = setTimeout(() => {
      setDisplay(value);
      setFlipping(false);
    }, 140);
    return () => clearTimeout(t);
  }, [value, reduced]);

  return (
    <span
      style={{
        display: 'inline-block',
        transition: flipping ? 'none' : 'transform 0.14s ease',
        transform: flipping ? 'translateY(-6px)' : 'translateY(0)',
        opacity: flipping ? 0 : 1,
        transitionProperty: 'transform, opacity',
      }}
    >
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

export default function Calculator() {
  const [bookings, setBookings] = useState(CALCULATOR.sliders[0].default);
  const [price, setPrice] = useState(CALCULATOR.sliders[1].default);
  const [noshow, setNoshow] = useState(CALCULATOR.sliders[2].default);

  const lostPerMonth = Math.round(bookings * 4 * (noshow / 100) * price);
  const savedPerMonth = Math.round(lostPerMonth * 0.3);
  const savedPerYear = savedPerMonth * 12;

  const setters = [setBookings, setPrice, setNoshow];
  const values = [bookings, price, noshow];

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 24,
      padding: '40px 32px',
      border: '1px solid rgba(255,255,255,0.08)',
      maxWidth: 520,
      width: '100%',
    }}>
      <h3 style={{
        fontFamily: "'Boska', Georgia, serif",
        color: 'white',
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 4,
        letterSpacing: -0.5,
      }}>
        How much are no-shows costing you?
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 28 }}>
        Drag the sliders — watch the money you're losing
      </p>

      {CALCULATOR.sliders.map((s, i) => (
        <div key={s.key} style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500 }}>
              {s.label}
            </span>
            <span style={{ color: '#F5F0E8', fontSize: 15, fontWeight: 800 }}>
              {s.unit === ' AED'
                ? <MechanicalNumber value={values[i]} suffix=" AED" />
                : <MechanicalNumber value={values[i]} suffix={s.unit} />}
            </span>
          </div>
          <input
            type="range"
            min={s.min}
            max={s.max}
            value={values[i]}
            onChange={e => setters[i](Number(e.target.value))}
            aria-label={s.label}
            style={{ width: '100%', accentColor: '#14B8A6', cursor: 'pointer' }}
          />
        </div>
      ))}

      <div style={{
        marginTop: 8,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: 24,
        display: 'flex',
        gap: 12,
      }}>
        {/* Physical card — loss */}
        <div style={{
          flex: 1,
          background: 'rgba(239,68,68,0.08)',
          borderRadius: 14,
          padding: '18px 16px',
          border: '1px solid rgba(239,68,68,0.15)',
          // Subtle paper grain via box-shadow layering
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.2)',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>You're losing</div>
          <div style={{ color: '#EF4444', fontSize: 28, fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
            <MechanicalNumber value={lostPerMonth} suffix=" AED" />
            <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.6 }}>/mo</span>
          </div>
        </div>

        {/* Physical card — gain */}
        <div style={{
          flex: 1,
          background: 'rgba(16,185,129,0.08)',
          borderRadius: 14,
          padding: '18px 16px',
          border: '1px solid rgba(16,185,129,0.15)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.2)',
        }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>We save you</div>
          <div style={{ color: '#10B981', fontSize: 28, fontWeight: 800, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
            <MechanicalNumber value={savedPerMonth} suffix=" AED" />
            <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.6 }}>/mo</span>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 12,
        background: 'rgba(245,240,232,0.05)',
        borderRadius: 14,
        padding: '14px 16px',
        border: '1px solid rgba(245,240,232,0.08)',
        textAlign: 'center',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>That's </span>
        <span style={{ fontFamily: "'Boska', Georgia, serif", color: '#F5F0E8', fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          <MechanicalNumber value={savedPerYear} suffix=" AED" />
        </span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}> saved per year</span>
      </div>
    </div>
  );
}
