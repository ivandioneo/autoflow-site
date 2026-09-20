import { useState, useEffect, useRef } from "react";

const DASHBOARD_URL = "https://dashboard.autoflow.ivanit.work";

// ─── Savings Calculator ───
function SavingsCalculator() {
  const [bookingsPerWeek, setBookingsPerWeek] = useState(40);
  const [avgPrice, setAvgPrice] = useState(150);
  const [noShowRate, setNoShowRate] = useState(20);

  const lostPerMonth = Math.round(bookingsPerWeek * 4 * (noShowRate / 100) * avgPrice);

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: "40px 32px", border: "1px solid rgba(255,255,255,0.08)",
      maxWidth: 520, width: "100%",
    }}>
      <h3 style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: -0.5 }}>
        How much could no-shows be costing you?
      </h3>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>
        Enter your numbers to see an illustrative estimate based on your inputs.
      </p>

      {[
        { label: "Bookings per week", value: bookingsPerWeek, set: setBookingsPerWeek, min: 5, max: 100, unit: "" },
        { label: "Average booking price", value: avgPrice, set: setAvgPrice, min: 30, max: 500, unit: " AED" },
        { label: "Your no-show rate", value: noShowRate, set: setNoShowRate, min: 5, max: 50, unit: "%" },
      ].map((s, i) => (
        <div key={i} style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500 }}>{s.label}</span>
            <span style={{ color: "#F59E0B", fontSize: 15, fontWeight: 800 }}>
              {s.unit === " AED" ? `${s.value} AED` : `${s.value}${s.unit}`}
            </span>
          </div>
          <input
            type="range" min={s.min} max={s.max} value={s.value}
            onChange={e => s.set(Number(e.target.value))}
            aria-label={s.label}
            style={{ width: "100%", accentColor: "#F59E0B", cursor: "pointer" }}
          />
        </div>
      ))}

      <div style={{
        marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24,
      }}>
        <div style={{
          background: "rgba(239,68,68,0.1)", borderRadius: 14, padding: "18px 16px",
          border: "1px solid rgba(239,68,68,0.15)", marginBottom: 12,
        }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Estimated monthly cost of no-shows</div>
          <div style={{ color: "#EF4444", fontSize: 28, fontWeight: 800, marginTop: 4 }}>
            {lostPerMonth.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>AED/mo</span>
          </div>
        </div>
        <div style={{
          background: "rgba(16,185,129,0.08)", borderRadius: 14, padding: "14px 16px",
          border: "1px solid rgba(16,185,129,0.12)", textAlign: "center",
        }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            Potential savings — even reducing no-shows partially can meaningfully recover this revenue
          </span>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <a
          href={DASHBOARD_URL}
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #0D9488, #14B8A6)",
            color: "white", padding: "13px 28px", borderRadius: 12,
            textDecoration: "none", fontWeight: 700, fontSize: 14,
            boxShadow: "0 6px 24px rgba(13,148,136,0.35)",
          }}
        >
          Create Your Business Page
        </a>
      </div>
    </div>
  );
}

// ─── Animated Phone ───
function PhoneMockup() {
  const [step, setStep] = useState(0);
  const msgs = [
    { dir: "in", text: "Hi, I'd like to book a haircut for Thursday 3pm", t: "10:32 AM" },
    { dir: "out", text: "\u2705 Booked! Thursday at 3:00 PM. We'll remind you!", t: "10:32 AM" },
    { dir: "out", text: "\u23f0 Reminder: Haircut tomorrow 3 PM. Reply YES to confirm.", t: "Wed 6:00 PM", slow: true },
    { dir: "in", text: "YES", t: "Wed 6:12 PM" },
    { dir: "out", text: "You're confirmed! See you tomorrow \ud83d\udc88", t: "Wed 6:12 PM" },
  ];

  useEffect(() => {
    if (step < msgs.length) {
      const d = msgs[step].slow ? 2400 : step === 0 ? 1400 : 1200;
      const timer = setTimeout(() => setStep(s => s + 1), d);
      return () => clearTimeout(timer);
    }
    const reset = setTimeout(() => setStep(0), 3000);
    return () => clearTimeout(reset);
  }, [step]);

  return (
    <div style={{ position: "relative" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 320, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 70%)",
          filter: "blur(40px)", zIndex: 0,
        }}
      />
      <div style={{
        position: "relative", zIndex: 1,
        width: 260, background: "#111", borderRadius: 32, padding: "6px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width: 80, height: 6, background: "#333", borderRadius: 3,
          margin: "6px auto 0",
        }} />
        <div style={{
          padding: "14px 14px 10px", display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 15, background: "#0D9488",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          }}>⦈</div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>GlowCuts Salon</div>
            <div style={{ color: "#14B8A6", fontSize: 10 }}>\u25cf booking open</div>
          </div>
        </div>
        <div style={{
          background: "#0B141A", borderRadius: 0, minHeight: 260, padding: "10px 8px",
          display: "flex", flexDirection: "column", gap: 5,
          borderBottomLeftRadius: 26, borderBottomRightRadius: 26,
        }}>
          {msgs.slice(0, step).map((m, i) => (
            <div key={i} style={{
              alignSelf: m.dir === "out" ? "flex-end" : "flex-start",
              background: m.dir === "out" ? "#005C4B" : "#1F2C34",
              padding: "6px 10px 3px", borderRadius: 8, maxWidth: "85%",
              animation: "msgPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <div style={{ fontSize: 12, color: "#E9EDEF", lineHeight: 1.35 }}>{m.text}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textAlign: "right", marginTop: 1 }}>{m.t}</div>
            </div>
          ))}
          {step < msgs.length && (
            <div style={{
              alignSelf: msgs[step].dir === "out" ? "flex-end" : "flex-start",
              background: msgs[step].dir === "out" ? "#005C4B" : "#1F2C34",
              padding: "8px 16px", borderRadius: 8,
            }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{
                    width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.3)",
                    animation: `dotPulse 1.2s ${d * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Animated Counter ───
function Counter({ target, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1600;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ─── Fade In Section ───
function FadeIn({ children, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: "opacity 0.7s ease, transform 0.7s ease",
    }}>
      {children}
    </div>
  );
}

// ─── Pricing Card ───
function PricingCard({ tier, tagline, desc, features, highlight, badge, ctaLabel }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: highlight
          ? "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"
          : "white",
        borderRadius: 20, padding: "36px 26px", flex: "1 1 260px", maxWidth: 320,
        border: highlight ? "1px solid rgba(245,158,11,0.3)" : "1px solid #E2E8F0",
        boxShadow: highlight
          ? hover ? "0 20px 60px rgba(245,158,11,0.2)" : "0 12px 40px rgba(15,23,42,0.3)"
          : hover ? "0 12px 32px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column", gap: 16,
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
    >
      {badge && (
        <div style={{
          background: "linear-gradient(135deg, #F59E0B, #F97316)",
          color: "white", fontWeight: 800, fontSize: 10, padding: "5px 14px",
          borderRadius: 20, alignSelf: "flex-start", textTransform: "uppercase", letterSpacing: 1,
        }}>{badge}</div>
      )}
      <div style={{ fontSize: 20, fontWeight: 800, color: highlight ? "white" : "#0F172A" }}>{tier}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: highlight ? "rgba(255,255,255,0.8)" : "#334155" }}>{tagline}</div>
      <div style={{ fontSize: 13, color: highlight ? "rgba(255,255,255,0.5)" : "#64748B", lineHeight: 1.5 }}>{desc}</div>
      <div style={{
        borderTop: `1px solid ${highlight ? "rgba(255,255,255,0.08)" : "#F1F5F9"}`,
        paddingTop: 18, display: "flex", flexDirection: "column", gap: 11,
      }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: highlight ? "rgba(255,255,255,0.8)" : "#475569" }}>
            <div style={{
              width: 18, height: 18, borderRadius: 6,
              background: highlight ? "rgba(16,185,129,0.15)" : "rgba(13,148,136,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: "#10B981", flexShrink: 0,
            }}>\u2713</div>
            <span>{f}</span>
          </div>
        ))}
      </div>
      <a
        href={DASHBOARD_URL}
        style={{
          marginTop: "auto", padding: "13px 20px", borderRadius: 12,
          background: highlight
            ? "linear-gradient(135deg, #F59E0B, #F97316)"
            : "#0D9488",
          color: "white", fontWeight: 700, fontSize: 14,
          textDecoration: "none", textAlign: "center", display: "block",
          transform: hover ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.2s",
        }}
      >
        {ctaLabel}
      </a>
    </div>
  );
}

// ─── Main Page ───
export default function AutoFlowLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#334155", background: "#F0F4F8", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes msgPop {
          from { opacity: 0; transform: scale(0.9) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes dotPulse {
          0%, 80% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        input[type=range]:focus { outline: 2px solid #14B8A6; outline-offset: 2px; }
        a:focus-visible, button:focus-visible { outline: 2px solid #14B8A6; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
        .nav-link:hover { color: white !important; }
        .login-link:hover { border-color: rgba(255,255,255,0.4) !important; color: white !important; }
        .cta-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .cta-secondary:hover { background: rgba(255,255,255,0.1) !important; }
      `}</style>

      {/* ─── SKIP LINK ─── */}
      <a
        href="#main-content"
        style={{
          position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden",
        }}
        onFocus={e => { e.target.style.cssText = "position:fixed;top:8px;left:8px;width:auto;height:auto;overflow:visible;background:#0D9488;color:white;padding:8px 16px;border-radius:8px;font-weight:700;z-index:9999;"; }}
        onBlur={e => { e.target.style.cssText = "position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;"; }}
      >
        Skip to main content
      </a>

      {/* ─── NAV ─── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: scrolled ? "12px 32px" : "18px 32px",
          background: scrolled ? "rgba(15,23,42,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          transition: "all 0.3s ease",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            aria-hidden="true"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #0D9488, #14B8A6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 900, fontSize: 17,
              boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
            }}
          >A</div>
          <span style={{ fontWeight: 900, fontSize: 19, color: "white", letterSpacing: -0.5 }}>AutoFlow</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="#calc" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, fontSize: 13, transition: "color 0.2s" }}>Calculator</a>
          <a href="#how" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, fontSize: 13, transition: "color 0.2s" }}>How it works</a>
          <a href="#pricing" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, fontSize: 13, transition: "color 0.2s" }}>Pricing</a>
          <a
            href={DASHBOARD_URL}
            className="login-link"
            style={{
              color: "rgba(255,255,255,0.75)", textDecoration: "none", fontWeight: 600, fontSize: 13,
              padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
              transition: "all 0.2s",
            }}
          >
            Log in
          </a>
          <a
            href={DASHBOARD_URL}
            className="cta-primary"
            style={{
              background: "linear-gradient(135deg, #0D9488, #14B8A6)",
              color: "white", padding: "9px 20px", borderRadius: 10,
              textDecoration: "none", fontWeight: 700, fontSize: 13,
              boxShadow: "0 4px 16px rgba(13,148,136,0.3)",
              transition: "opacity 0.2s, transform 0.2s",
            }}
          >
            Create Your Business Page
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <main id="main-content">
        <section
          aria-label="Hero"
          style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F172A 100%)",
            backgroundSize: "200% 200%",
            animation: "gradientShift 12s ease infinite",
            padding: "120px 32px 80px", position: "relative", overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute", top: -100, right: -100, width: 400, height: 400,
              borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)",
              filter: "blur(60px)", pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute", bottom: -80, left: -80, width: 300, height: 300,
              borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
              filter: "blur(50px)", pointerEvents: "none",
            }}
          />

          <div style={{
            maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "center", gap: 56, position: "relative",
          }}>
            <div style={{ flex: "1 1 420px", maxWidth: 540 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.2)",
                padding: "6px 16px", borderRadius: 24, marginBottom: 20,
              }}>
                <div
                  aria-hidden="true"
                  style={{ width: 6, height: 6, borderRadius: 3, background: "#14B8A6", animation: "dotPulse 2s infinite" }}
                />
                <span style={{ color: "#14B8A6", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Booking automation for UAE businesses
                </span>
              </div>

              <h1 style={{
                fontSize: 52, fontWeight: 900, color: "white", lineHeight: 1.08,
                letterSpacing: -1.5, marginBottom: 20,
              }}>
                Put your business on{" "}
                <span style={{
                  background: "linear-gradient(135deg, #14B8A6, #F59E0B)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>autopilot.</span>
              </h1>
              <p style={{
                fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.7,
                marginBottom: 32, maxWidth: 440,
              }}>
                Create your booking page, publish it, and let customers book themselves — while AutoFlow sends confirmations and reminders automatically. Built for salons, clinics, tutors, and travel agencies in the UAE.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
                <a
                  href={DASHBOARD_URL}
                  className="cta-primary"
                  style={{
                    background: "linear-gradient(135deg, #0D9488, #14B8A6)",
                    color: "white", padding: "16px 32px", borderRadius: 14,
                    textDecoration: "none", fontWeight: 800, fontSize: 16,
                    boxShadow: "0 8px 32px rgba(13,148,136,0.35)",
                    transition: "opacity 0.2s, transform 0.2s", display: "inline-block",
                  }}
                >
                  Create Your Business Page
                </a>
                <a
                  href="#calc"
                  className="cta-secondary"
                  style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "white", padding: "16px 28px", borderRadius: 14,
                    textDecoration: "none", fontWeight: 600, fontSize: 15,
                    transition: "background 0.2s",
                  }}
                >
                  Estimate Your Savings ↓
                </a>
              </div>
            </div>
            <div style={{ flex: "0 0 auto", animation: "float 6s ease-in-out infinite" }}>
              <PhoneMockup />
            </div>
          </div>
        </section>

        {/* ─── SAVINGS CALCULATOR ─── */}
        <section
          id="calc"
          aria-label="Savings calculator"
          style={{
            background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
            padding: "72px 32px 80px",
          }}
        >
          <FadeIn>
            <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center", justifyContent: "center" }}>
              <div style={{ flex: "1 1 340px", maxWidth: 440 }}>
                <h2 style={{ fontSize: 34, fontWeight: 900, color: "white", lineHeight: 1.15, letterSpacing: -1, marginBottom: 16 }}>
                  See what no-shows could be costing you
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                  Use the calculator to estimate the revenue impact of no-shows based on your own numbers. The more appointments you run, the more a reduction in no-shows can matter.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { icon: "\ud83d\udcc9", text: "Every no-show is an empty slot you can't fill" },
                    { icon: "\u23f0", text: "Manual confirmation calls take time away from your business" },
                    { icon: "\u2705", text: "Automated reminders let customers confirm without back-and-forth" },
                  ].map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span aria-hidden="true" style={{ fontSize: 20 }}>{p.icon}</span>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{p.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <SavingsCalculator />
            </div>
          </FadeIn>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section id="how" aria-label="How it works" style={{ padding: "80px 32px", background: "#F8FAFC" }}>
          <FadeIn>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h2 style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", letterSpacing: -1 }}>How it works</h2>
                <p style={{ color: "#94A3B8", fontSize: 15, marginTop: 8 }}>
                  From booking page to confirmed customer \u2014 fully automated
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
                {[
                  { icon: "\ud83d\udcc4", title: "Create your page", desc: "Set up your business booking page in minutes. Add your services, availability, and branding.", color: "#0D9488" },
                  { icon: "\ud83d\udd17", title: "Share your link", desc: "Publish your booking page and share it wherever your customers find you.", color: "#F59E0B" },
                  { icon: "\ud83d\udcac", title: "Customers book", desc: "They pick a time, fill in their details, and confirm. No back-and-forth messages needed.", color: "#8B5CF6" },
                  { icon: "\u26a1", title: "AutoFlow takes over", desc: "Confirmations and reminders go out automatically. You just show up.", color: "#EF4444" },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex: "1 1 200px", maxWidth: 210, textAlign: "center", padding: "28px 16px",
                    background: "white", borderRadius: 18, border: "1px solid #E2E8F0",
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                      width: 40, height: 3, borderRadius: 2, background: s.color,
                    }} />
                    <div
                      aria-hidden="true"
                      style={{
                        width: 52, height: 52, borderRadius: 16, margin: "8px auto 14px",
                        background: `${s.color}12`, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 24,
                      }}
                    >{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A", marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <a
                  href={DASHBOARD_URL}
                  style={{
                    display: "inline-block",
                    background: "#0D9488", color: "white",
                    padding: "14px 32px", borderRadius: 12,
                    textDecoration: "none", fontWeight: 700, fontSize: 15,
                    boxShadow: "0 6px 24px rgba(13,148,136,0.25)",
                  }}
                >
                  Create Your Business Page
                </a>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ─── USE CASES ─── */}
        <section aria-label="Who it's for" style={{ padding: "72px 32px", background: "white" }}>
          <FadeIn>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", textAlign: "center", marginBottom: 12, letterSpacing: -0.5 }}>
                Built for businesses like yours
              </h2>
              <p style={{ color: "#94A3B8", textAlign: "center", fontSize: 15, marginBottom: 40 }}>
                If people book time with you, AutoFlow helps keep those bookings on track
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
                {[
                  { icon: "\ud83d\udc87", title: "Salons", desc: "Automated booking confirmations and reminders so your chair stays full." },
                  { icon: "\ud83c\udfe5", title: "Clinics", desc: "Reduce manual follow-up calls with automated patient reminders." },
                  { icon: "\ud83d\udcda", title: "Tutors", desc: "Keep sessions on schedule with automatic booking confirmations." },
                  { icon: "\ud83d\udc85", title: "Spas", desc: "Let customers self-book and receive reminders without manual effort." },
                  { icon: "\u2708\ufe0f", title: "Travel", desc: "Send automated pre-trip reminders and booking confirmations." },
                ].map((c, i) => (
                  <div key={i} style={{
                    background: "#F8FAFC", borderRadius: 18, padding: "24px 20px",
                    flex: "1 1 170px", maxWidth: 190, border: "1px solid #E2E8F0",
                    textAlign: "center",
                  }}>
                    <div aria-hidden="true" style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A", marginBottom: 8 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ─── PRICING ─── */}
        <section id="pricing" aria-label="Pricing" style={{ padding: "80px 32px", background: "#F8FAFC" }}>
          <FadeIn>
            <div style={{ maxWidth: 1060, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 44 }}>
                <h2 style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", letterSpacing: -1 }}>Simple, honest pricing</h2>
                <p style={{ color: "#94A3B8", fontSize: 15, marginTop: 8 }}>Plans for every stage — start free and grow from there.</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", alignItems: "stretch" }}>
                <PricingCard
                  tier="Starter"
                  tagline="Free to get started"
                  desc="Create your booking page and start accepting bookings with automated confirmations."
                  ctaLabel="Get Started Free"
                  features={[
                    "Business booking page",
                    "Automated booking confirmations",
                    "Basic reminder automation",
                    "AutoFlow dashboard access",
                  ]}
                />
                <PricingCard
                  tier="Professional"
                  tagline="For growing businesses"
                  desc="More automation capacity and controls for businesses with a regular booking volume."
                  highlight badge="Popular"
                  ctaLabel="Get Started"
                  features={[
                    "Everything in Starter",
                    "Higher automation capacity",
                    "Customisable reminder sequences",
                    "Booking analytics",
                    "Priority support",
                  ]}
                />
                <PricingCard
                  tier="Business"
                  tagline="For larger operations"
                  desc="Expanded automation and support for businesses running higher booking volumes."
                  ctaLabel="Get Started"
                  features={[
                    "Everything in Professional",
                    "Increased automation limits",
                    "Advanced workflow configuration",
                    "Dedicated onboarding support",
                  ]}
                />
              </div>
              <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, marginTop: 28 }}>
                Already a customer?{" "}
                <a href={DASHBOARD_URL} style={{ color: "#0D9488", fontWeight: 700, textDecoration: "none" }}>Log in to your dashboard \u2192</a>
              </p>
            </div>
          </FadeIn>
        </section>

        {/* ─── SECURITY ─── */}
        <section aria-label="Security and data" style={{ padding: "48px 32px" }}>
          <FadeIn>
            <div style={{
              maxWidth: 800, margin: "0 auto",
              background: "linear-gradient(135deg, #0F172A, #1E293B)", borderRadius: 20,
              padding: "36px 32px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: "rgba(13,148,136,0.15)", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0,
              }} aria-hidden="true">\ud83d\udd12</div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: "white", marginBottom: 6 }}>
                  Designed with data separation in mind
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                  AutoFlow is built as a multi-tenant platform where each business account
                  operates in its own isolated context. Access controls are enforced
                  server-side, so your booking data and customer details are scoped to
                  your account only. We take a security-first approach to how the platform
                  is architected and operated.
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section
          aria-label="Get started"
          style={{
            padding: "80px 32px",
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            textAlign: "center",
          }}
        >
          <FadeIn>
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: "white", letterSpacing: -1, marginBottom: 14 }}>
                Ready to put your bookings on autopilot?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                Create your business page and start accepting bookings with automated confirmations and reminders.
              </p>
              <a
                href={DASHBOARD_URL}
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #0D9488, #14B8A6)",
                  color: "white", padding: "18px 40px", borderRadius: 14,
                  textDecoration: "none", fontWeight: 800, fontSize: 17,
                  boxShadow: "0 8px 40px rgba(13,148,136,0.4)",
                }}
              >
                Create Your Business Page
              </a>
            </div>
          </FadeIn>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer
        role="contentinfo"
        style={{
          background: "#0F172A", padding: "48px 32px", textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <div
            aria-hidden="true"
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #0D9488, #14B8A6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 900, fontSize: 15,
            }}
          >A</div>
          <span style={{ fontWeight: 900, fontSize: 17, color: "white" }}>AutoFlow</span>
        </div>
        <nav aria-label="Footer navigation" style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
          <a href="#calc" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>Calculator</a>
          <a href="#pricing" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>Pricing</a>
          <a href="#how" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>How it works</a>
          <a href={DASHBOARD_URL} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>Log in</a>
        </nav>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 6 }}>
          Booking automation for businesses in the UAE
        </div>
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>\u00a9 2026 AutoFlow. All rights reserved.</div>
      </footer>
    </div>
  );
}
