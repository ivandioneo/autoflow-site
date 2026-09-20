import { useState, useEffect, useRef } from "react";

const DASHBOARD_URL = "https://dashboard.autoflow.ivanit.work";

/* ─── Reduced-motion helper ─────────────────────────────────────────── */
function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ─── Fade-in on scroll ─────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: reduced ? "none" : (visible ? "translateY(0)" : "translateY(24px)"),
        transition: reduced ? "none" : `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/*
 * ─── Flow-A Logo — Concept 01: "Modern Flow" ────────────────────────────
 *
 * Design brief:
 *   A custom letterform A where the RIGHT LEG does not stop at the
 *   baseline — it extends past the foot, bends forward-right, and
 *   terminates as an integrated arrowhead.  This communicates forward
 *   motion / flow / automation as part of the letterform itself.
 *
 * Geometry (viewBox 44 × 38):
 *
 *   LEFT LEG  : M 2,36  L 19,3          — angled stroke, left side
 *   CROSSBAR  : M 10,23 L 30,23         — horizontal bar ~60% up
 *   RIGHT LEG : M 19,3  L 33,34         — angled stroke, right side
 *   EXTENSION : L 40,28                 — right leg bends forward-right
 *   ARROWHEAD : ← two short strokes closing the arrowhead at (40,28)
 *                 up-back:   M 40,28 L 34,22
 *                 down-back: M 40,28 L 36,35
 *
 * The arrowhead is PART OF the right leg path, not a separate element.
 * The gradient runs left→right so the arrow tip glows brightest.
 *
 * No background shape, no rounded-square container.
 * Works at 24 px through 200 px.
 */
function FlowALogo({ size = 34, white = false }) {
  const uid = useRef(`fg-${Math.random().toString(36).slice(2, 7)}`);
  const gid = uid.current;

  const stroke = white ? "white" : `url(#${gid})`;

  return (
    <svg
      width={size}
      height={Math.round(size * 38 / 44)}
      viewBox="0 0 44 38"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      {!white && (
        <defs>
          <linearGradient id={gid} x1="0" y1="19" x2="44" y2="19" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#0BBFB8" />
            <stop offset="100%" stopColor="#14E8D4" />
          </linearGradient>
        </defs>
      )}

      {/* Left leg */}
      <line
        x1="2"  y1="36"
        x2="19" y2="3"
        stroke={stroke}
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* Crossbar */}
      <line
        x1="10" y1="23"
        x2="30" y2="23"
        stroke={stroke}
        strokeWidth="3.0"
        strokeLinecap="round"
      />

      {/*
       * Right leg → extension → arrowhead tip.
       * Single continuous path:
       *   apex (19,3) → foot (33,34) → arrow tip (40,27)
       *
       * Then the two arrowhead feathers back from (40,27):
       *   up-feather  : (40,27) → (33,21)
       *   down-feather: (40,27) → (37,35)
       */}
      <path
        d="M 19,3 L 33,34 L 40,27"
        stroke={stroke}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrowhead feathers — slightly thinner so they read as the tip */}
      <path
        d="M 33,21 L 40,27 L 37,35"
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ─── Animated counting number ──────────────────────────────────────── */
function Counter({ target, suffix = "", duration = 1400 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setVal(target); return; }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setVal(Math.round(ease * target));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, reduced]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Phone Mockup ──────────────────────────────────────────────────── */
function PhoneMockup() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const reduced = useReducedMotion();

  const services = [
    { name: "Haircut", duration: "30 min", price: "AED 60" },
    { name: "Haircut + Beard", duration: "45 min", price: "AED 80" },
    { name: "Full Grooming", duration: "60 min", price: "AED 120" },
  ];
  const dates = [
    { label: "Today", sub: "Sep 20" },
    { label: "Tomorrow", sub: "Sep 21" },
    { label: "Mon", sub: "Sep 22" },
  ];
  const times = ["2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"];

  useEffect(() => {
    if (reduced) { setStep(4); setSelectedService(0); setSelectedDate(0); setSelectedTime("3:00 PM"); return; }
    const delays = [2400, 2000, 1800, 2200, 3200];
    const d = delays[step] ?? 2000;
    const timer = setTimeout(() => {
      if (step === 0) setSelectedService(0);
      if (step === 1) setSelectedDate(2);
      if (step === 2) setSelectedTime("3:00 PM");
      if (step === 4) {
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedTime(null);
      }
      setStep(s => (s + 1) % 5);
    }, d);
    return () => clearTimeout(timer);
  }, [step, reduced]);

  const confirmed = step === 4;

  const sidebarCards = [
    {
      color: "#10B981",
      label: "Booking confirmed",
      sub: "Customer receives instant confirmation",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      color: "#F59E0B",
      label: "Automatic reminders",
      sub: "We handle the follow-ups",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      color: "#14B8A6",
      label: "You get more customers",
      sub: "Less no-shows, more revenue",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
  ];

  /*
   * Layout: a 3-column grid
   *   col 1 (flex): phone body
   *   col 2 (fixed 200px): sidebar cards
   *   col 3 (fixed 160px): annotation — occupies the top of this column;
   *                         the column is tall enough that the annotation
   *                         sits clearly above the card group.
   *
   * The annotation column is to the RIGHT of the cards column.
   * A curved dashed arrow exits the annotation text and curves
   * down-left, pointing toward the phone.
   *
   * On narrow screens the entire PhoneMockup is hidden via CSS
   * (.hero-phone display:none at < 900px) so no collision at mobile.
   */
  return (
    <div style={{
      position: "relative",
      display: "flex",
      alignItems: "flex-start",
      gap: 20,
    }}>
      {/* Ambient glow — behind phone */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: "30%", left: 80,
        width: 300, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(20,184,166,0.20) 0%, transparent 68%)",
        filter: "blur(44px)", zIndex: 0, pointerEvents: "none",
      }} />

      {/* ── Phone ── */}
      <div style={{
        position: "relative", zIndex: 1,
        width: 248,
        background: "#0d1117",
        borderRadius: 38,
        padding: "10px 8px 8px",
        boxShadow: "0 32px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}>
        {/* Notch */}
        <div style={{ width: 72, height: 5, background: "#222", borderRadius: 3, margin: "0 auto 8px" }} />

        {/* Header */}
        <div style={{
          background: "#111820", borderRadius: "24px 24px 0 0",
          padding: "12px 14px 10px",
          display: "flex", alignItems: "center", gap: 10,
          borderBottom: "1px solid rgba(20,184,166,0.12)",
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 17,
            background: "linear-gradient(135deg, #0c1a24, #142030)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(13,148,136,0.4)",
            border: "1px solid rgba(20,184,166,0.25)",
          }}>
            <FlowALogo size={22} />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 13, letterSpacing: -0.2 }}>GlowCuts Salon</div>
            <div style={{ color: "#14B8A6", fontSize: 10, fontWeight: 500 }}>Book an appointment</div>
          </div>
        </div>

        {/* Body */}
        <div style={{
          background: "#F8FAFC",
          minHeight: 310,
          padding: "12px 12px 14px",
          borderRadius: "0 0 30px 30px",
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}>
          {confirmed ? (
            <div style={{ textAlign: "center", padding: "30px 8px" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 26,
                background: "linear-gradient(135deg, #0D9488, #14B8A6)",
                margin: "0 auto 14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 24px rgba(13,148,136,0.35)",
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div style={{ color: "#0D9488", fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Booking Confirmed!</div>
              <div style={{ color: "#64748B", fontSize: 11, lineHeight: 1.5 }}>
                Mon Sep 22 · 3:00 PM<br />
                Confirmation sent to your phone
              </div>
            </div>
          ) : (
            <>
              {/* Services */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ color: "#64748B", fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>① Select a service</div>
                {services.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "7px 10px", borderRadius: 8, marginBottom: 4,
                    background: selectedService === i ? "rgba(13,148,136,0.08)" : "#F1F5F9",
                    border: `1px solid ${selectedService === i ? "rgba(13,148,136,0.3)" : "transparent"}`,
                    transition: "all 0.25s ease", cursor: "default",
                  }}>
                    <div>
                      <div style={{ color: "#1E293B", fontSize: 11, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ color: "#94A3B8", fontSize: 9 }}>{s.duration}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#1E293B", fontSize: 11, fontWeight: 700 }}>{s.price}</span>
                      <div style={{
                        width: 14, height: 14, borderRadius: 7,
                        border: `2px solid ${selectedService === i ? "#0D9488" : "#CBD5E1"}`,
                        background: selectedService === i ? "#0D9488" : "transparent",
                        transition: "all 0.25s ease",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {selectedService === i && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <polyline points="1.5 4 3 5.5 6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dates */}
              {selectedService !== null && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: "#64748B", fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>② Choose a date</div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {dates.map((d, i) => (
                      <div key={i} style={{
                        flex: 1, textAlign: "center", padding: "6px 4px", borderRadius: 8,
                        background: selectedDate === i ? "#0D9488" : "#F1F5F9",
                        cursor: "default", transition: "all 0.25s ease",
                      }}>
                        <div style={{ color: selectedDate === i ? "white" : "#64748B", fontSize: 9, fontWeight: 600 }}>{d.label}</div>
                        <div style={{ color: selectedDate === i ? "rgba(255,255,255,0.8)" : "#94A3B8", fontSize: 8 }}>{d.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Times */}
              {selectedDate !== null && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: "#64748B", fontSize: 10, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>③ Select a time</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {times.map((t, i) => (
                      <div key={i} style={{
                        padding: "5px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                        background: selectedTime === t ? "#0D9488" : "#F1F5F9",
                        color: selectedTime === t ? "white" : "#475569",
                        transition: "all 0.25s ease", cursor: "default",
                      }}>{t}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm button */}
              {selectedTime && (
                <div style={{
                  background: "linear-gradient(135deg, #0D9488, #14B8A6)",
                  borderRadius: 8, padding: "8px 12px",
                  textAlign: "center", color: "white",
                  fontSize: 11, fontWeight: 700,
                  marginTop: 4,
                  boxShadow: "0 4px 14px rgba(13,148,136,0.4)",
                }}>
                  Confirm Booking →
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Right column: cards + annotation ── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        alignItems: "flex-start",
        position: "relative",
        zIndex: 2,
      }}>

        {/*
         * Annotation block — sits at the TOP of this column, above the
         * cards. It has its own clear vertical space (~120px) before the
         * first card begins.
         *
         * The annotation text is in the top-right area.
         * The curved dashed arrow exits from the bottom-left of the
         * annotation SVG, curves down and to the LEFT, with the
         * arrowhead pointing toward the phone body.
         */}
        <div
          aria-hidden="true"
          style={{
            marginBottom: 28,
            paddingLeft: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",   /* push text to the right */
            width: 190,
          }}
        >
          {/* Annotation text */}
          <div style={{
            fontFamily: "'Segoe Script', 'Brush Script MT', 'Comic Sans MS', cursive",
            color: "#14B8A6",
            fontSize: 13,
            lineHeight: 1.5,
            textAlign: "right",
            opacity: 0.9,
            fontStyle: "italic",
            marginBottom: 2,
          }}>
            It just works<br />in the background.
          </div>

          {/*
           * Curved arrow: starts near (110,4) — under the text, right side —
           * curves down-left to tip at (8,72) — pointing toward the phone.
           * ViewBox 120 × 80.
           */}
          <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            fill="none"
            style={{ display: "block", marginTop: -2 }}
          >
            <path
              d="M 108,6 C 90,20 60,30 20,68"
              stroke="#14B8A6"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
            {/* Arrowhead at tip (20,68) pointing down-left */}
            <path
              d="M 20,68 L 10,60 M 20,68 L 27,58"
              stroke="#14B8A6"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ── Sidebar cards — below annotation ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sidebarCards.map((c, i) => (
            <div key={i} style={{
              background: "rgba(13,20,30,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(20,184,166,0.15)",
              borderRadius: 12,
              padding: "10px 14px",
              width: 190,
              display: "flex", alignItems: "flex-start", gap: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: `${c.color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{c.icon}</div>
              <div>
                <div style={{ color: "white", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{c.label}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, lineHeight: 1.4 }}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Savings Calculator ─────────────────────────────────────────────── */
function SavingsCalculator() {
  const [apptPerMonth, setApptPerMonth] = useState(50);

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(20px)",
      borderRadius: 20,
      padding: "28px 32px",
      border: "1px solid rgba(20,184,166,0.12)",
      maxWidth: 680,
      width: "100%",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        flexWrap: "wrap",
      }}>
        {/* Left: label + slider */}
        <div style={{ flex: "1 1 260px" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            Estimate your monthly time savings
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 500 }}>Appointments per month</span>
            <span style={{ color: "white", fontSize: 20, fontWeight: 800 }}>{apptPerMonth}</span>
          </div>
          <input
            type="range" min={10} max={200} step={5} value={apptPerMonth}
            onChange={e => setApptPerMonth(Number(e.target.value))}
            aria-label="Appointments per month"
            style={{ width: "100%", accentColor: "#14B8A6", cursor: "pointer", height: 4 }}
          />
        </div>

        {/* Right: CTA button */}
        <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <a
            href={DASHBOARD_URL}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "linear-gradient(135deg, #0D9488, #14B8A6)",
              color: "white", padding: "14px 22px", borderRadius: 12,
              textDecoration: "none", fontWeight: 700, fontSize: 15,
              boxShadow: "0 6px 24px rgba(13,148,136,0.35)",
              transition: "box-shadow 0.2s ease, transform 0.15s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 36px rgba(13,148,136,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(13,148,136,0.35)"; e.currentTarget.style.transform = ""; }}
          >
            Estimate Your Savings →
          </a>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textAlign: "center" }}>
            It takes less than 30 seconds.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Global styles ──────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #060d14; color: #e2e8f0; line-height: 1.6; }
  a { color: inherit; }
  button { cursor: pointer; font: inherit; }
  input[type=range]::-webkit-slider-thumb { cursor: pointer; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  .nav-link { color: rgba(255,255,255,0.65); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
  .nav-link:hover { color: white; }
  .cta-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #0D9488, #14B8A6);
    color: white; padding: 12px 22px; border-radius: 10px;
    text-decoration: none; font-weight: 700; font-size: 14px;
    box-shadow: 0 4px 20px rgba(13,148,136,0.35);
    transition: box-shadow 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .cta-primary:hover { box-shadow: 0 8px 32px rgba(13,148,136,0.5); transform: translateY(-1px); }
  .cta-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    color: white; padding: 12px 22px; border-radius: 10px;
    text-decoration: none; font-weight: 600; font-size: 14px;
    transition: background 0.2s, border-color 0.2s;
    white-space: nowrap;
  }
  .cta-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
  @media (max-width: 900px) {
    .hero-grid { flex-direction: column !important; }
    .hero-phone { display: none !important; }
    .how-steps { flex-direction: column !important; gap: 32px !important; }
    .step-connector { display: none !important; }
    .industry-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .calc-grid { flex-direction: column !important; }
    .pricing-grid { flex-direction: column !important; align-items: center !important; }
    .pricing-card { max-width: 360px !important; width: 100% !important; }
    .footer-grid { flex-direction: column !important; gap: 32px !important; }
    .nav-links { display: none !important; }
    .calc-inner { flex-direction: column !important; }
  }
  @media (max-width: 600px) {
    .hero-headline { font-size: clamp(2rem, 8vw, 3.5rem) !important; }
    .section-title { font-size: clamp(1.6rem, 6vw, 2.5rem) !important; }
    .industry-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

/* ─── App ────────────────────────────────────────────────────────────── */
export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById("autoflow-global-styles");
    if (!el) {
      const style = document.createElement("style");
      style.id = "autoflow-global-styles";
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
    const link = document.getElementById("autoflow-font");
    if (!link) {
      const l = document.createElement("link");
      l.id = "autoflow-font";
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap";
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Calculator", href: "#calculator" },
    { label: "Use cases", href: "#industries" },
  ];

  const BG = "#060d14";
  const SECTION_ALT = "#081018";

  return (
    <div style={{ background: BG, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: scrolled ? "1px solid rgba(20,184,166,0.1)" : "1px solid transparent",
        background: scrolled ? "rgba(6,13,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all 0.3s ease",
      }}>
        <nav style={{
          maxWidth: 1160, margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo: Flow-A mark + wordmark */}
          <a href="#" aria-label="AutoFlow home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <FlowALogo size={36} />
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 17, letterSpacing: -0.5, lineHeight: 1.1 }}>
                Auto<span style={{ color: "#14B8A6" }}>Flow</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, letterSpacing: 2.5, fontWeight: 500, textTransform: "uppercase" }}>
                Book · Automate · Grow
              </div>
            </div>
          </a>

          {/* Nav links */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href={DASHBOARD_URL} className="nav-link" style={{ fontSize: 14 }}>Log in</a>
            <a href={DASHBOARD_URL} className="cta-primary" style={{ padding: "10px 18px", fontSize: 13 }}>
              Create Your Business Page →
            </a>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{
        maxWidth: 1160, margin: "0 auto",
        padding: "72px 24px 80px",
        position: "relative",
      }}>
        {/* Background glow */}
        <div aria-hidden="true" style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 500,
          background: "radial-gradient(ellipse at 50% 0%, rgba(13,148,136,0.14) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div className="hero-grid" style={{ display: "flex", alignItems: "center", gap: 60 }}>
          {/* Left */}
          <div style={{ flex: "1 1 480px", position: "relative", zIndex: 1 }}>
            <FadeIn>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)",
                color: "#14B8A6", padding: "6px 14px", borderRadius: 20,
                fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase",
                marginBottom: 28,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#14B8A6", display: "inline-block" }} />
                Booking automation for UAE businesses
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <h1 className="hero-headline" style={{
                fontSize: "clamp(2.6rem, 5vw, 4rem)",
                fontWeight: 900, lineHeight: 1.05, letterSpacing: -1.5,
                color: "white", marginBottom: 24,
              }}>
                Turn bookings<br />
                into a <span style={{ color: "#14B8A6" }}>flow.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={140}>
              <p style={{
                color: "rgba(255,255,255,0.55)", fontSize: 17, lineHeight: 1.7,
                maxWidth: 440, marginBottom: 36,
              }}>
                Create your booking page, let customers choose their time,
                and let AutoFlow handle the confirmations and reminders.
              </p>
            </FadeIn>

            <FadeIn delay={200}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}>
                <a href={DASHBOARD_URL} className="cta-primary" style={{ padding: "15px 28px", fontSize: 15 }}>
                  Create Your Business Page →
                </a>
                <a href="#how-it-works" className="cta-secondary" style={{ padding: "15px 24px", fontSize: 15 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                  </svg>
                  See How It Works
                </a>
              </div>
            </FadeIn>

            {/* Hero trust icons */}
            <FadeIn delay={260}>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>Save time</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Automate routine tasks</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>Get more bookings</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Make it easy for customers</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                    <line x1="2" y1="20" x2="22" y2="20" />
                  </svg>
                  <div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>Focus on growth</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Let AutoFlow do the rest</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right — phone */}
          <div className="hero-phone" style={{ flex: "0 0 auto" }}>
            <FadeIn delay={180}>
              <PhoneMockup />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ background: SECTION_ALT, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ marginBottom: 64 }}>
              <div style={{ color: "#14B8A6", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
                HOW IT WORKS
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                <h2 className="section-title" style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 900, color: "white", letterSpacing: -1, lineHeight: 1.1, maxWidth: 320,
                }}>
                  A simple flow<br />for real results.
                </h2>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, maxWidth: 300, lineHeight: 1.7 }}>
                  From setup to confirmed bookings —<br />AutoFlow keeps your business moving.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Steps with curved SVG wave connector */}
          <div style={{ position: "relative" }}>
            <svg
              className="step-connector"
              aria-hidden="true"
              viewBox="0 0 900 60"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                top: 28,
                left: "12.5%",
                width: "75%",
                height: 60,
                zIndex: 0,
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              <path
                d="M0 30 C80 10, 160 50, 300 30 C440 10, 520 50, 600 30 C680 10, 760 50, 900 30"
                stroke="rgba(20,184,166,0.45)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 4"
              />
            </svg>

            <div className="how-steps" style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative", zIndex: 1 }}>
              {[
                {
                  num: "01",
                  title: "Create",
                  desc: "Set up your booking page in minutes.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  ),
                },
                {
                  num: "02",
                  title: "Share",
                  desc: "Publish the link on your website, social media, or QR code.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  ),
                },
                {
                  num: "03",
                  title: "Customers book",
                  desc: "They choose a service, date, and time.",
                  icon: (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  ),
                },
                {
                  num: "04",
                  title: "AutoFlow takes over",
                  desc: "Confirmations and reminders go out automatically.",
                  isLogo: true,
                },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
                  <FadeIn delay={i * 100} style={{ width: "100%" }}>
                    <div style={{ textAlign: "center", padding: "0 12px" }}>
                      <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
                        {s.num}
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                        <div style={{
                          width: 64, height: 64, borderRadius: 32,
                          background: s.isLogo
                            ? "linear-gradient(135deg, #0D9488, #14B8A6)"
                            : "rgba(20,184,166,0.1)",
                          border: `2px solid ${s.isLogo ? "transparent" : "rgba(20,184,166,0.35)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: s.isLogo ? "0 8px 28px rgba(13,148,136,0.4)" : "none",
                        }}>
                          {s.isLogo
                            ? <FlowALogo size={30} white={true} />
                            : s.icon
                          }
                        </div>
                      </div>
                      <div style={{ color: "white", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</div>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.6, maxWidth: 160, margin: "0 auto" }}>{s.desc}</div>
                    </div>
                  </FadeIn>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section id="industries" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", gap: 60, alignItems: "flex-start", flexWrap: "wrap" }}>
          <FadeIn style={{ flex: "0 0 260px" }}>
            <div style={{ color: "#14B8A6", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              BUILT FOR REAL BUSINESSES
            </div>
            <h2 className="section-title" style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900, color: "white", letterSpacing: -1, lineHeight: 1.1, marginBottom: 16,
            }}>
              Works for<br />every industry.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7 }}>
              From salons to clinics, fitness studios to consultants — AutoFlow adapts to your business.
            </p>
          </FadeIn>

          <div style={{ flex: 1 }}>
            <div className="industry-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12,
            }}>
              {[
                {
                  title: "Beauty & Salon",
                  desc: "Hair, nails, spa and more",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="6" cy="6" r="3" />
                      <circle cx="6" cy="18" r="3" />
                      <line x1="20" y1="4" x2="8.12" y2="15.88" />
                      <line x1="14.47" y1="14.48" x2="20" y2="20" />
                      <line x1="8.12" y1="8.12" x2="12" y2="12" />
                    </svg>
                  ),
                },
                {
                  title: "Health & Wellness",
                  desc: "Clinics, dental, therapy",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z" />
                    </svg>
                  ),
                },
                {
                  title: "Education",
                  desc: "Tutoring, training, workshops",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                  ),
                },
                {
                  title: "Fitness & Sports",
                  desc: "Gyms, personal training",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 5v14M18 5v14" />
                      <path d="M2 9v6M22 9v6" />
                      <line x1="6" y1="12" x2="18" y2="12" />
                    </svg>
                  ),
                },
                {
                  title: "Professional Services",
                  desc: "Consultations, coaching, and more",
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  ),
                },
              ].map((ind, i) => (
                <FadeIn key={i} delay={i * 60}>
                  <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(20,184,166,0.1)",
                    borderRadius: 16, padding: "20px 14px",
                    textAlign: "center",
                    transition: "background 0.2s, border-color 0.2s",
                    cursor: "default",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(20,184,166,0.06)"; e.currentTarget.style.borderColor = "rgba(20,184,166,0.25)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(20,184,166,0.1)"; }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>{ind.icon}</div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{ind.title}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, lineHeight: 1.5 }}>{ind.desc}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section id="calculator" style={{ background: SECTION_ALT, padding: "96px 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="calc-grid" style={{ display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap" }}>
            <FadeIn style={{ flex: "1 1 300px" }}>
              <div style={{ color: "#14B8A6", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
                CALCULATOR
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: "rgba(20,184,166,0.1)",
                  border: "1px solid rgba(20,184,166,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Chart">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h2 style={{
                  fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                  fontWeight: 900, color: "white", letterSpacing: -0.8, lineHeight: 1.1,
                }}>
                  See how much<br />time you can save.
                </h2>
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7 }}>
                Fewer manual tasks. More time for what matters.
              </p>
            </FadeIn>

            <FadeIn delay={120} style={{ flex: "1 1 400px" }}>
              <SavingsCalculator />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div style={{ color: "#14B8A6", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
                PRICING
              </div>
              <h2 style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 900, color: "white", letterSpacing: -1, marginBottom: 14,
              }}>
                Simple, transparent pricing.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16 }}>
                Choose the plan that fits your business.
              </p>
            </div>
          </FadeIn>

          <div className="pricing-grid" style={{ display: "flex", gap: 20, justifyContent: "center", alignItems: "stretch", flexWrap: "wrap" }}>
            {[
              {
                name: "Starter", sub: "Start booking", price: "49", popular: false,
                features: ["Booking page", "Automated confirmations", "Email support"],
              },
              {
                name: "Professional", sub: "Automate more", price: "99", popular: true,
                features: ["Everything in Starter", "Custom branding", "Advanced reminders", "Priority support"],
              },
              {
                name: "Business", sub: "Scale your flow", price: "199", popular: false,
                features: ["Everything in Professional", "Multiple locations", "Team access", "Advanced customization"],
              },
            ].map((plan, i) => (
              <FadeIn key={i} delay={i * 80} style={{ flex: "1 1 260px", maxWidth: 320 }}>
                <div className="pricing-card" style={{
                  background: plan.popular ? "rgba(20,184,166,0.07)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${plan.popular ? "rgba(20,184,166,0.4)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 20, padding: "28px 24px 28px",
                  height: "100%", display: "flex", flexDirection: "column",
                  position: "relative", overflow: "hidden",
                }}>
                  {plan.popular && (
                    <div style={{
                      position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #0D9488, #14B8A6)",
                      color: "white", fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                      padding: "4px 18px", borderRadius: "0 0 10px 10px",
                    }}>MOST POPULAR</div>
                  )}

                  <div style={{ marginTop: plan.popular ? 16 : 0, marginBottom: 20 }}>
                    <div style={{ color: "white", fontWeight: 800, fontSize: 18, marginBottom: 2 }}>{plan.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{plan.sub}</div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <span style={{ color: "white", fontSize: 42, fontWeight: 900, letterSpacing: -1.5 }}>
                      AED {plan.price}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginLeft: 4 }}>/month</span>
                  </div>

                  <ul style={{ listStyle: "none", marginBottom: 28, flex: 1 }}>
                    {plan.features.map((f, fi) => (
                      <li key={fi} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 9, flexShrink: 0,
                          background: plan.popular ? "rgba(20,184,166,0.2)" : "rgba(255,255,255,0.08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <polyline points="2 6 5 9 10 3" stroke={plan.popular ? "#14B8A6" : "rgba(255,255,255,0.5)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a href={DASHBOARD_URL} style={{
                    display: "block", textAlign: "center",
                    background: plan.popular ? "linear-gradient(135deg, #0D9488, #14B8A6)" : "rgba(255,255,255,0.07)",
                    border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.12)",
                    color: "white", padding: "13px",
                    borderRadius: 12, textDecoration: "none",
                    fontWeight: 700, fontSize: 14,
                    boxShadow: plan.popular ? "0 6px 24px rgba(13,148,136,0.35)" : "none",
                    transition: "all 0.2s ease",
                  }}
                    onMouseEnter={e => {
                      if (plan.popular) { e.currentTarget.style.boxShadow = "0 10px 36px rgba(13,148,136,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }
                      else e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    }}
                    onMouseLeave={e => {
                      if (plan.popular) { e.currentTarget.style.boxShadow = "0 6px 24px rgba(13,148,136,0.35)"; e.currentTarget.style.transform = ""; }
                      else e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    }}
                  >
                    Get Started
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section style={{ background: SECTION_ALT, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 40,
              borderTop: "1px solid rgba(20,184,166,0.1)",
              paddingTop: 60,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flex: "1 1 400px" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                  background: "rgba(20,184,166,0.1)",
                  border: "1px solid rgba(20,184,166,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="Security">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <div style={{ color: "#14B8A6", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                    SECURITY &amp; YOUR DATA
                  </div>
                  <h2 style={{ color: "white", fontWeight: 900, fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: -0.5, marginBottom: 10 }}>
                    Your data stays yours.
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7 }}>
                    Designed with data separation in mind. Your business data is isolated and secure.
                  </p>
                </div>
              </div>

              <div style={{ flex: "0 0 auto", textAlign: "center" }}>
                <div style={{ color: "#14B8A6", fontWeight: 900, fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", letterSpacing: -0.3, marginBottom: 6 }}>
                  Simple. Secure. Reliable.
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                  Built for businesses that value their customers.
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "60px 24px 40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48, gap: 40, flexWrap: "wrap" }}>
            <div>
              <a href="#" aria-label="AutoFlow home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <FlowALogo size={28} />
                <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>Auto<span style={{ color: "#14B8A6" }}>Flow</span></span>
              </a>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
                Book · Automate · Grow
              </p>
            </div>

            {/* Nav */}
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {navLinks.map(l => (
                <a key={l.href} href={l.href} className="nav-link" style={{ fontSize: 13 }}>{l.label}</a>
              ))}
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 24,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 12,
          }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>
              SAME BUSINESS. MORE TIME. A BRIGHTER TOMORROW.
            </p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
              © 2026 AutoFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
