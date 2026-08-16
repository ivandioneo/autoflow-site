import { useState, useEffect, useRef } from "react";

const DASHBOARD_URL = "https://dashboard.autoflow.ivanit.work";
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "";

function scrollToQuote() {
  const el = document.getElementById("quote");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ─── Savings Calculator ───
function SavingsCalculator() {
  const [bookingsPerWeek, setBookingsPerWeek] = useState(40);
  const [avgPrice, setAvgPrice] = useState(150);
  const [noShowRate, setNoShowRate] = useState(20);

  const lostPerMonth = Math.round(bookingsPerWeek * 4 * (noShowRate / 100) * avgPrice);
  const savedPerMonth = Math.round(lostPerMonth * 0.3);
  const savedPerYear = savedPerMonth * 12;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
      borderRadius: 24, padding: "40px 32px", border: "1px solid rgba(255,255,255,0.08)",
      maxWidth: 520, width: "100%",
    }}>
      <h3 style={{ color: "white", fontSize: "clamp(1.1rem,2vw,1.4rem)", fontWeight: 800, marginBottom: 4, letterSpacing: -0.5, fontFamily: "inherit" }}>
        How much are no-shows costing you?
      </h3>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.75rem,1.2vw,0.85rem)", marginBottom: 28 }}>
        Drag the sliders — watch the money you're losing
      </p>

      {[
        { label: "Bookings per week", value: bookingsPerWeek, set: setBookingsPerWeek, min: 5, max: 100, unit: "" },
        { label: "Average booking price", value: avgPrice, set: setAvgPrice, min: 30, max: 500, unit: " AED" },
        { label: "Your no-show rate", value: noShowRate, set: setNoShowRate, min: 5, max: 50, unit: "%" },
      ].map((s, i) => (
        <div key={i} style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.75rem,1.2vw,0.85rem)", fontWeight: 500 }}>{s.label}</span>
            <span style={{ color: "#F59E0B", fontSize: "clamp(0.85rem,1.5vw,0.95rem)", fontWeight: 800 }}>
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
        display: "flex", gap: 12,
      }}>
        <div style={{
          flex: 1, background: "rgba(239,68,68,0.1)", borderRadius: 14, padding: "18px 16px",
          border: "1px solid rgba(239,68,68,0.15)",
        }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.65rem,1vw,0.75rem)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>You're losing</div>
          <div style={{ color: "#EF4444", fontSize: "clamp(1.4rem,3vw,1.75rem)", fontWeight: 800, marginTop: 4 }}>
            {lostPerMonth.toLocaleString()} <span style={{ fontSize: "clamp(0.8rem,1.5vw,0.9rem)", fontWeight: 600 }}>AED/mo</span>
          </div>
        </div>
        <div style={{
          flex: 1, background: "rgba(16,185,129,0.1)", borderRadius: 14, padding: "18px 16px",
          border: "1px solid rgba(16,185,129,0.15)",
        }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.65rem,1vw,0.75rem)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>We save you</div>
          <div style={{ color: "#10B981", fontSize: "clamp(1.4rem,3vw,1.75rem)", fontWeight: 800, marginTop: 4 }}>
            {savedPerMonth.toLocaleString()} <span style={{ fontSize: "clamp(0.8rem,1.5vw,0.9rem)", fontWeight: 600 }}>AED/mo</span>
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 12, background: "rgba(245,158,11,0.08)", borderRadius: 14, padding: "14px 16px",
        border: "1px solid rgba(245,158,11,0.12)", textAlign: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.75rem,1.2vw,0.8rem)" }}>That's </span>
        <span style={{ color: "#F59E0B", fontSize: "clamp(1.1rem,2.5vw,1.4rem)", fontWeight: 800 }}>{savedPerYear.toLocaleString()} AED</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.75rem,1.2vw,0.8rem)" }}> saved per year</span>
      </div>
    </div>
  );
}

// ─── Animated Phone ───
function PhoneMockup() {
  const [step, setStep] = useState(0);
  const msgs = [
    { dir: "in", text: "Hi, I'd like to book a haircut for Thursday 3pm", t: "10:32 AM" },
    { dir: "out", text: "✅ Booked! Thursday at 3:00 PM. We'll remind you!", t: "10:32 AM" },
    { dir: "out", text: "⏰ Reminder: Haircut tomorrow 3 PM. Reply YES to confirm.", t: "Wed 6:00 PM", slow: true },
    { dir: "in", text: "YES", t: "Wed 6:12 PM" },
    { dir: "out", text: "You're confirmed! See you tomorrow 💈", t: "Wed 6:12 PM" },
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
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 320, height: 420, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 70%)",
        filter: "blur(40px)", zIndex: 0,
      }} />
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
            width: 30, height: 30, borderRadius: 15, background: "#25D366",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          }}>💈</div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>GlowCuts Salon</div>
            <div style={{ color: "#25D366", fontSize: 10 }}>● online</div>
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
function PricingCard({ tier, price, desc, features, highlight, badge, onCta, ctaLabel }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: highlight
          ? "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"
          : "white",
        borderRadius: 20,
        padding: highlight ? "44px 28px" : "36px 26px",
        flex: highlight ? "1 1 280px" : "1 1 260px",
        maxWidth: highlight ? 340 : 310,
        border: highlight ? "1px solid rgba(245,158,11,0.4)" : "1px solid #E2E8F0",
        boxShadow: highlight
          ? hover
            ? "0 28px 72px rgba(245,158,11,0.28), 0 0 0 1px rgba(245,158,11,0.2)"
            : "0 16px 48px rgba(245,158,11,0.18), 0 0 0 1px rgba(245,158,11,0.12)"
          : hover ? "0 12px 32px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column", gap: 16,
        transform: highlight
          ? hover ? "translateY(-8px) scale(1.03)" : "translateY(-4px) scale(1.02)"
          : hover ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.3s ease",
        cursor: "default",
        position: "relative",
        zIndex: highlight ? 2 : 1,
      }}
    >
      {badge && (
        <div style={{
          background: "linear-gradient(135deg, #F59E0B, #F97316)",
          color: "white", fontWeight: 800, fontSize: 10, padding: "5px 14px",
          borderRadius: 20, alignSelf: "flex-start", textTransform: "uppercase", letterSpacing: 1,
        }}>{badge}</div>
      )}
      <div style={{ fontSize: "clamp(1rem,2vw,1.25rem)", fontWeight: 800, color: highlight ? "white" : "#0F172A", fontFamily: "'Instrument Serif', Georgia, serif" }}>{tier}</div>
      <div style={{ fontSize: "clamp(0.8rem,1.3vw,0.85rem)", color: highlight ? "rgba(255,255,255,0.5)" : "#64748B", lineHeight: 1.5 }}>{desc}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 900, color: highlight ? "white" : "#0F172A", letterSpacing: -1, fontFamily: "'Instrument Serif', Georgia, serif" }}>{price}</span>
        {price !== "Free" && <span style={{ fontSize: "clamp(0.8rem,1.3vw,0.9rem)", color: highlight ? "rgba(255,255,255,0.4)" : "#94A3B8" }}>/month</span>}
      </div>
      <div style={{
        borderTop: `1px solid ${highlight ? "rgba(255,255,255,0.08)" : "#F1F5F9"}`,
        paddingTop: 18, display: "flex", flexDirection: "column", gap: 11,
      }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: "clamp(0.78rem,1.3vw,0.85rem)", color: highlight ? "rgba(255,255,255,0.8)" : "#475569" }}>
            <div style={{
              width: 18, height: 18, borderRadius: 6,
              background: highlight ? "rgba(16,185,129,0.15)" : "rgba(13,148,136,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: "#10B981", flexShrink: 0,
            }}>✓</div>
            <span>{f}</span>
          </div>
        ))}
      </div>
      <button
        onClick={onCta}
        style={{
          marginTop: "auto", padding: "13px 20px", borderRadius: 12, border: "none",
          background: highlight
            ? "linear-gradient(135deg, #F59E0B, #F97316)"
            : "#0D9488",
          color: "white", fontWeight: 700, fontSize: "clamp(0.8rem,1.4vw,0.9rem)", cursor: "pointer",
          transition: "transform 0.2s",
          transform: hover ? "scale(1.02)" : "scale(1)",
        }}>
        {ctaLabel}
      </button>
    </div>
  );
}

// ─── Main Page ───
export default function AutoFlowLanding() {
  const [form, setForm] = useState({ name: "", business: "", email: "", whatsapp: "", type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const sanitize = (str) => str.replace(/<[^>]*>/g, "").replace(/[<>"'`]/g, "").trim();
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidWhatsApp = (num) => {
    const digits = num.replace(/[\s\-\+\(\)]/g, "");
    return /^[1-9]\d{6,14}$/.test(digits);
  };
  const isValidName = (name) => /^[a-zA-Z\s\-'.]{2,50}$/.test(name);

  const lastSubmitRef = useRef(0);

  const handleInputChange = (key, value) => {
    let processed = value;
    if (key === "email") processed = value.toLowerCase().trim();
    if (key === "whatsapp") processed = value.replace(/[^0-9+\-\s()]/g, "");
    if (key === "name" || key === "business") processed = value.replace(/[^a-zA-Z\s\-'.]/g, "");
    if (key === "message") processed = value.slice(0, 500);
    setForm(prev => ({ ...prev, [key]: processed }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name || !isValidName(form.name)) e.name = "Enter a valid name (letters only, 2-50 chars)";
    if (!form.business || form.business.trim().length < 2) e.business = "Enter a business name";
    if (!form.email || !isValidEmail(form.email)) e.email = "Enter a valid email address";
    if (!form.whatsapp || !isValidWhatsApp(form.whatsapp)) e.whatsapp = "Enter a valid phone number (7-15 digits)";
    if (!form.type) e.type = "Select a business type";
    if (form.message && form.message.length > 500) e.message = "Message too long (max 500 characters)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    const now = Date.now();
    if (now - lastSubmitRef.current < 10000) return;
    if (!validate()) return;
    if (!WEBHOOK_URL) {
      setErrors({ submit: "Form is not configured. Please contact us directly." });
      return;
    }
    setSubmitting(true);
    lastSubmitRef.current = now;
    try {
      const sanitizedForm = {
        name: sanitize(form.name),
        business: sanitize(form.business),
        email: form.email.toLowerCase().trim(),
        whatsapp: form.whatsapp.replace(/[^0-9+\-\s()]/g, ""),
        type: form.type,
        message: sanitize(form.message).slice(0, 500),
      };
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedForm),
        mode: "no-cors",
        referrerPolicy: "no-referrer",
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: "Something went wrong. Please try again." });
    }
    setSubmitting(false);
  };

  const displayFont = "'Instrument Serif', Georgia, serif";

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#334155", background: "#F0F4F8", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');
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
        input:focus, textarea:focus { border-color: #0D9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); }
        a:focus-visible, button:focus-visible { outline: 2px solid #14B8A6; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
        @media (prefers-color-scheme: dark) {
          body { background: #0F172A !important; color: #CBD5E1 !important; }
        }
        .nav-link:hover { color: white !important; }
        .login-link:hover { border-color: rgba(255,255,255,0.4) !important; color: white !important; }
        .mobile-nav-links a {
          display: block;
          padding: 12px 0;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: color 0.2s;
        }
        .mobile-nav-links a:hover { color: white; }
        .phone-float { animation: float 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .phone-float { animation: none !important; } }
        @media (max-width: 640px) { .phone-float { display: none; } }
        @media (min-width: 641px) { .mobile-menu-btn { display: none !important; } }
        @media (max-width: 640px) { .desktop-nav-links { display: none !important; } }
        .timeline-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 28px;
          left: calc(50% + 28px);
          right: calc(-50% + 28px);
          height: 2px;
          background: linear-gradient(90deg, rgba(13,148,136,0.4), rgba(245,158,11,0.2));
        }
        @media (max-width: 640px) {
          .timeline-step:not(:last-child)::after { display: none; }
          .timeline-row { flex-direction: column !important; align-items: flex-start !important; gap: 0 !important; }
          .timeline-step { max-width: 100% !important; flex: 1 1 100% !important; flex-direction: row !important; gap: 14px; text-align: left !important; padding: 16px 0 !important; border-bottom: 1px solid rgba(0,0,0,0.06); }
          .timeline-step:last-child { border-bottom: none; }
          .timeline-icon-wrap { flex-shrink: 0; margin: 0 !important; }
        }
      `}</style>

      {/* ─── SKIP LINK ─── */}
      <a href="#main" style={{
        position: "absolute", top: -40, left: 8, background: "#0D9488", color: "white",
        padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600,
        textDecoration: "none", zIndex: 9999, transition: "top 0.2s",
      }}
        onFocus={e => e.target.style.top = "8px"}
        onBlur={e => e.target.style.top = "-40px"}
      >Skip to content</a>

      {/* ─── NAV ─── */}
      <nav aria-label="Main navigation" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: scrolled ? "12px 32px" : "18px 32px",
        background: scrolled ? "rgba(15,23,42,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div aria-hidden="true" style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #0D9488, #14B8A6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 900, fontSize: 17,
            boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
          }}>A</div>
          <span style={{ fontWeight: 900, fontSize: 19, color: "white", letterSpacing: -0.5, fontFamily: displayFont }}>AutoFlow</span>
        </div>

        {/* Desktop nav */}
        <div className="desktop-nav-links" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="#calc" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, fontSize: 13, transition: "color 0.2s" }}>Calculator</a>
          <a href="#how" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, fontSize: 13, transition: "color 0.2s" }}>How it works</a>
          <a href="#pricing" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, fontSize: 13, transition: "color 0.2s" }}>Pricing</a>
          <a href={DASHBOARD_URL} className="login-link" style={{
            color: "rgba(255,255,255,0.75)", textDecoration: "none", fontWeight: 600, fontSize: 13,
            padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
            transition: "all 0.2s",
          }}>Log in</a>
          <a href="#quote" style={{
            background: "linear-gradient(135deg, #F59E0B, #F97316)",
            color: "white", padding: "9px 20px", borderRadius: 10,
            textDecoration: "none", fontWeight: 700, fontSize: 13,
            boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
          }}>Get a Quote</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen(o => !o)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "white", padding: "8px", display: "flex", flexDirection: "column",
            gap: 5, alignItems: "center", justifyContent: "center",
          }}
        >
          {mobileNavOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          )}
        </button>
      </nav>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, zIndex: 99,
          background: "rgba(15,23,42,0.98)", backdropFilter: "blur(20px)",
          padding: "16px 32px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div className="mobile-nav-links">
            <a href="#calc" onClick={() => setMobileNavOpen(false)}>Calculator</a>
            <a href="#how" onClick={() => setMobileNavOpen(false)}>How it works</a>
            <a href="#pricing" onClick={() => setMobileNavOpen(false)}>Pricing</a>
            <a href={DASHBOARD_URL} onClick={() => setMobileNavOpen(false)}>Log in</a>
          </div>
          <a href="#quote"
            onClick={() => setMobileNavOpen(false)}
            style={{
              display: "block", marginTop: 16,
              background: "linear-gradient(135deg, #F59E0B, #F97316)",
              color: "white", padding: "13px 20px", borderRadius: 12,
              textDecoration: "none", fontWeight: 700, fontSize: 15, textAlign: "center",
            }}>Get a Quote</a>
        </div>
      )}

      {/* ─── HERO ─── */}
      <main id="main">
      <section style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F172A 100%)",
        backgroundSize: "200% 200%",
        animation: "gradientShift 12s ease infinite",
        padding: "120px 32px 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -100, right: -100, width: 400, height: 400,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80, width: 300, height: 300,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />

        <div style={{
          maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "center", gap: 56, position: "relative",
        }}>
          <div style={{ flex: "1 1 420px", maxWidth: 540 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
              padding: "6px 16px", borderRadius: 24, marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: "#F59E0B", animation: "dotPulse 2s infinite" }} />
              <span style={{ color: "#F59E0B", fontSize: "clamp(0.7rem,1.2vw,0.8rem)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Automation built for UAE businesses
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(2.2rem,6vw,3.5rem)", fontWeight: 700, color: "white", lineHeight: 1.08,
              letterSpacing: -1.5, marginBottom: 20, fontFamily: displayFont,
            }}>
              Put your business on{" "}
              <span style={{
                background: "linear-gradient(135deg, #14B8A6, #F59E0B)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>autopilot.</span>
            </h1>
            <p style={{
              fontSize: "clamp(0.95rem,1.8vw,1.1rem)", color: "rgba(255,255,255,0.5)", lineHeight: 1.7,
              marginBottom: 32, maxWidth: 440,
            }}>
              Automated reminders, follow-ups, and booking confirmations that run on their own — so you stop chasing customers and start reclaiming your time. Built for salons, clinics, tutors, and travel agencies in the UAE.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
              <a href="#quote" style={{
                background: "linear-gradient(135deg, #F59E0B, #F97316)",
                color: "white", padding: "16px 32px", borderRadius: 14,
                textDecoration: "none", fontWeight: 800, fontSize: "clamp(0.9rem,1.8vw,1rem)",
                boxShadow: "0 8px 32px rgba(245,158,11,0.35)",
                transition: "transform 0.2s", display: "inline-block",
              }}>Request a Free Quote</a>
              <a href="#calc" style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "white", padding: "16px 28px", borderRadius: 14,
                textDecoration: "none", fontWeight: 600, fontSize: "clamp(0.85rem,1.6vw,0.95rem)",
              }}>Calculate Your Savings ↓</a>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: "clamp(0.7rem,1.2vw,0.85rem)", color: "rgba(255,255,255,0.35)" }}>
              <span>✦ No setup fees</span>
              <span>✦ Works with WhatsApp</span>
              <span>✦ Cancel anytime</span>
            </div>
          </div>
          <div className="phone-float">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ─── SAVINGS CALCULATOR ─── */}
      <section id="calc" style={{
        background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
        padding: "72px 32px 80px",
      }}>
        <FadeIn>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center", justifyContent: "center" }}>
            <div style={{ flex: "1 1 340px", maxWidth: 440 }}>
              <h2 style={{ fontSize: "clamp(1.5rem,3.5vw,2.2rem)", fontWeight: 700, color: "white", lineHeight: 1.15, letterSpacing: -1, marginBottom: 16, fontFamily: displayFont }}>
                See exactly how much you're leaving on the table
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.85rem,1.6vw,0.95rem)", lineHeight: 1.7, marginBottom: 24 }}>
                The average appointment business loses 15–30% of revenue to no-shows. Drag the sliders to see your numbers — then let us fix them.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "📉", text: "Every no-show = an empty slot you can't fill" },
                  { icon: "⏰", text: "Staff calling to confirm = hours wasted weekly" },
                  { icon: "✅", text: "Automated reminders cut no-shows by 30% on average" },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 20 }}>{p.icon}</span>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.8rem,1.4vw,0.9rem)" }}>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <SavingsCalculator />
          </div>
        </FadeIn>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ background: "white", padding: "48px 32px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap",
          justifyContent: "center", gap: 48,
        }}>
          {[
            { n: 30, s: "%", label: "Average no-show reduction" },
            { n: 5, s: " min", label: "Setup time" },
            { n: 24, s: "/7", label: "Runs while you sleep" },
            { n: 0, s: "", label: "Messages you send manually" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", minWidth: 160 }}>
              <div style={{ fontSize: "clamp(2rem,5vw,2.75rem)", fontWeight: 900, color: "#0F172A", letterSpacing: -1, fontFamily: displayFont }}>
                {s.n === 0 ? "0" : <Counter target={s.n} />}{s.s}
              </div>
              <div style={{ fontSize: "clamp(0.75rem,1.2vw,0.85rem)", color: "#94A3B8", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS — Timeline ─── */}
      <section id="how" style={{ padding: "80px 32px", background: "#F8FAFC" }}>
        <FadeIn>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontSize: "clamp(1.5rem,3.5vw,2.1rem)", fontWeight: 700, color: "#0F172A", letterSpacing: -1, fontFamily: displayFont }}>How it works</h2>
              <p style={{ color: "#94A3B8", fontSize: "clamp(0.85rem,1.5vw,0.95rem)", marginTop: 8 }}>
                From booking to confirmation — fully automated in 4 steps
              </p>
            </div>

            <div className="timeline-row" style={{ display: "flex", gap: 0, justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
              {[
                { num: "01", title: "Customer books", desc: "Via your form, phone, Instagram, or walk-in. We connect to however you take bookings.", color: "#0D9488" },
                { num: "02", title: "Flow triggers", desc: "Our automation engine picks it up instantly — no delay, no manual entry needed.", color: "#F59E0B" },
                { num: "03", title: "Reminders go out", desc: "WhatsApp or SMS, 24h and 2h before. Customer confirms or reschedules right in the chat.", color: "#0D9488" },
                { num: "04", title: "Everything logged", desc: "Dashboard shows confirmed, pending, no-shows. You see the full picture at a glance.", color: "#F59E0B" },
              ].map((s, i) => (
                <div key={i} className="timeline-step" style={{
                  flex: "1 1 0", maxWidth: "23%", textAlign: "center",
                  padding: "0 12px", position: "relative",
                }}>
                  {/* Number badge */}
                  <div className="timeline-icon-wrap" style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${s.color}22, ${s.color}11)`,
                    border: `2px solid ${s.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <span style={{
                      fontSize: "clamp(0.9rem,1.8vw,1.1rem)", fontWeight: 900,
                      color: s.color, fontFamily: displayFont, letterSpacing: -0.5,
                    }}>{s.num}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "clamp(0.85rem,1.5vw,1rem)", color: "#0F172A", marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: "clamp(0.75rem,1.2vw,0.85rem)", color: "#64748B", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── USE CASES ─── */}
      <section style={{ padding: "72px 32px", background: "white" }}>
        <FadeIn>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 700, color: "#0F172A", textAlign: "center", marginBottom: 12, letterSpacing: -0.5, fontFamily: displayFont }}>
              Built for businesses like yours
            </h2>
            <p style={{ color: "#94A3B8", textAlign: "center", fontSize: "clamp(0.85rem,1.5vw,0.95rem)", marginBottom: 40 }}>
              If people book time with you, we make sure they show up
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
              {[
                { icon: "💇", title: "Salons", stat: "28%", desc: "average no-show rate in UAE salons. Reminders cut that to under 10%." },
                { icon: "🏥", title: "Clinics", stat: "4 hrs", desc: "per week staff spend calling patients to confirm. Zero with automation." },
                { icon: "📚", title: "Tutors", stat: "3x", desc: "more rebookings when students get a follow-up after their session." },
                { icon: "💅", title: "Spas", stat: "AED 600+", desc: "average revenue recovered per month from prevented no-shows." },
                { icon: "✈️", title: "Travel", stat: "92%", desc: "of travelers appreciate pre-trip reminders (visa, docs, check-in)." },
              ].map((c, i) => (
                <div key={i} style={{
                  background: "#F8FAFC", borderRadius: 18, padding: "24px 20px",
                  flex: "1 1 170px", maxWidth: 190, border: "1px solid #E2E8F0",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: "clamp(0.85rem,1.5vw,0.95rem)", color: "#0F172A", marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontWeight: 900, color: "#0D9488", marginBottom: 6, fontFamily: displayFont }}>{c.stat}</div>
                  <div style={{ fontSize: "clamp(0.75rem,1.2vw,0.8rem)", color: "#64748B", lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ padding: "80px 32px", background: "#F8FAFC" }}>
        <FadeIn>
          <div style={{ maxWidth: 1060, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontSize: "clamp(1.5rem,3.5vw,2.1rem)", fontWeight: 700, color: "#0F172A", letterSpacing: -1, fontFamily: displayFont }}>Simple, honest pricing</h2>
              <p style={{ color: "#94A3B8", fontSize: "clamp(0.85rem,1.5vw,0.95rem)", marginTop: 8 }}>Start free. Upgrade when the ROI is obvious.</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", alignItems: "center" }}>
              <PricingCard tier="Starter" price="Free" desc="Try it with basic reminders"
                ctaLabel="Start Free" onCta={scrollToQuote}
                features={["1 active automation", "Up to 50 reminders/month", "WhatsApp or SMS", "Basic dashboard"]} />
              <PricingCard tier="Professional" price="AED 149" desc="For businesses that can't afford no-shows" highlight badge="Most Popular"
                ctaLabel="Get Started" onCta={scrollToQuote}
                features={["5 active automations", "Unlimited reminders", "WhatsApp + SMS", "No-show tracking dashboard", "Follow-up sequences", "Priority support"]} />
              <PricingCard tier="Business" price="AED 349" desc="Full automation suite, custom workflows"
                ctaLabel="Get Started" onCta={scrollToQuote}
                features={["Unlimited automations", "Custom workflow builds", "Multi-location support", "Lead capture + CRM sync", "Dedicated account manager", "Monthly performance report"]} />
            </div>
            <p style={{ textAlign: "center", color: "#94A3B8", fontSize: "clamp(0.75rem,1.2vw,0.85rem)", marginTop: 28 }}>
              Already a customer? <a href={DASHBOARD_URL} style={{ color: "#0D9488", fontWeight: 700, textDecoration: "none" }}>Log in to your dashboard →</a>
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ─── SECURITY ─── */}
      <section style={{ padding: "48px 32px" }}>
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
            }}>🔒</div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontWeight: 700, fontSize: "clamp(1rem,2vw,1.15rem)", color: "white", marginBottom: 6, fontFamily: displayFont }}>
                Built security-first, from the ground up
              </div>
              <div style={{ fontSize: "clamp(0.78rem,1.3vw,0.85rem)", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                Every account is fully isolated — one business can never see another's data,
                credentials, or automations. Access is enforced at the server, not just hidden
                in the interface. We run continuous security monitoring and intrusion detection
                across our own infrastructure, so your customers' details stay yours alone.
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── QUOTE FORM ─── */}
      <section id="quote" style={{ padding: "80px 32px", background: "white" }}>
        <FadeIn>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2 style={{ fontSize: "clamp(1.5rem,3.5vw,2.1rem)", fontWeight: 700, color: "#0F172A", letterSpacing: -1, fontFamily: displayFont }}>
                Get your free automation plan
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "clamp(0.85rem,1.5vw,0.95rem)", marginTop: 8 }}>
                Tell us about your business — we'll design your first flow and set it up for free.
              </p>
            </div>
            {submitted ? (
              <div style={{
                background: "#F0FDF4", borderRadius: 20, padding: "56px 32px",
                textAlign: "center", border: "1px solid #BBF7D0",
              }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <div style={{ fontSize: "clamp(1.1rem,2.5vw,1.4rem)", fontWeight: 800, color: "#0F172A", marginBottom: 8, fontFamily: displayFont }}>
                  You're in!
                </div>
                <div style={{ color: "#64748B", fontSize: "clamp(0.8rem,1.4vw,0.9rem)", lineHeight: 1.6 }}>
                  We'll reach out on WhatsApp within 24 hours with your custom automation plan. No payment needed to start.
                </div>
              </div>
            ) : (
              <div style={{
                background: "#F8FAFC", borderRadius: 20, padding: "36px 28px",
                border: "1px solid #E2E8F0",
              }}>
                {errors.submit && (
                  <div role="alert" style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: "#DC2626", fontSize: "clamp(0.75rem,1.2vw,0.85rem)" }}>
                    {errors.submit}
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
                  {[
                    { key: "name", label: "Your name", ph: "Ahmed", w: "1 1 48%", type: "text", maxLen: 50 },
                    { key: "business", label: "Business name", ph: "GlowCuts Salon", w: "1 1 48%", type: "text", maxLen: 50 },
                    { key: "email", label: "Email", ph: "ahmed@glowcuts.ae", w: "1 1 48%", type: "email", maxLen: 100 },
                    { key: "whatsapp", label: "WhatsApp", ph: "+971 50 123 4567", w: "1 1 48%", type: "tel", maxLen: 20 },
                  ].map(f => (
                    <div key={f.key} style={{ flex: f.w }}>
                      <label htmlFor={`field-${f.key}`} style={{ fontSize: "clamp(0.7rem,1.1vw,0.78rem)", fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.3 }}>
                        {f.label}
                      </label>
                      <input
                        id={`field-${f.key}`}
                        type={f.type}
                        placeholder={f.ph}
                        value={form[f.key]}
                        maxLength={f.maxLen}
                        onChange={e => handleInputChange(f.key, e.target.value)}
                        aria-invalid={!!errors[f.key]}
                        aria-describedby={errors[f.key] ? `err-${f.key}` : undefined}
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: 10,
                          border: errors[f.key] ? "1px solid #EF4444" : "1px solid #E2E8F0",
                          fontSize: "clamp(0.8rem,1.4vw,0.9rem)", outline: "none",
                          fontFamily: "inherit", background: "white", transition: "all 0.2s",
                        }}
                      />
                      {errors[f.key] && (
                        <p id={`err-${f.key}`} role="alert" style={{ color: "#EF4444", fontSize: "clamp(0.65rem,1vw,0.72rem)", marginTop: 4 }}>{errors[f.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <fieldset style={{ border: "none", padding: 0 }}>
                    <legend style={{ fontSize: "clamp(0.7rem,1.1vw,0.78rem)", fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.3 }}>
                      Business type
                    </legend>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {["Salon", "Clinic", "Tutor", "Spa", "Travel", "Other"].map(t => (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={form.type === t}
                          onClick={() => { setForm(prev => ({ ...prev, type: t })); if (errors.type) setErrors(prev => ({ ...prev, type: null })); }}
                          style={{
                            padding: "8px 16px", borderRadius: 10, fontSize: "clamp(0.78rem,1.3vw,0.85rem)", fontWeight: 600,
                            border: form.type === t ? "2px solid #0D9488" : errors.type ? "1px solid #EF4444" : "1px solid #E2E8F0",
                            background: form.type === t ? "rgba(13,148,136,0.08)" : "white",
                            color: form.type === t ? "#0D9488" : "#64748B",
                            cursor: "pointer", transition: "all 0.2s", minHeight: 44,
                          }}
                        >{t}</button>
                      ))}
                    </div>
                  </fieldset>
                  {errors.type && (
                    <p role="alert" style={{ color: "#EF4444", fontSize: "clamp(0.65rem,1vw,0.72rem)", marginTop: 4 }}>{errors.type}</p>
                  )}
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="field-message" style={{ fontSize: "clamp(0.7rem,1.1vw,0.78rem)", fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.3 }}>
                    What do you need automated?
                  </label>
                  <textarea
                    id="field-message"
                    placeholder="e.g. appointment reminders, follow-ups, booking confirmations..."
                    value={form.message} rows={3}
                    maxLength={500}
                    onChange={e => handleInputChange("message", e.target.value)}
                    aria-describedby="msg-count"
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 10,
                      border: "1px solid #E2E8F0", fontSize: "clamp(0.8rem,1.4vw,0.9rem)", outline: "none",
                      fontFamily: "inherit", resize: "vertical", background: "white",
                      transition: "all 0.2s",
                    }}
                  />
                  <p id="msg-count" style={{ textAlign: "right", fontSize: "clamp(0.65rem,1vw,0.72rem)", color: "#94A3B8", marginTop: 2 }}>
                    {form.message.length}/500
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%", padding: "16px", borderRadius: 14, border: "none",
                    background: submitting ? "#94A3B8" : "linear-gradient(135deg, #F59E0B, #F97316)",
                    color: "white", fontWeight: 800, fontSize: "clamp(0.9rem,1.8vw,1rem)",
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: submitting ? "none" : "0 8px 32px rgba(245,158,11,0.3)",
                    transition: "all 0.2s", minHeight: 52,
                  }}
                >
                  {submitting ? "Submitting..." : "Submit — It's Free"}
                </button>
                <p style={{ textAlign: "center", fontSize: "clamp(0.7rem,1.1vw,0.78rem)", color: "#94A3B8", marginTop: 10 }}>
                  No payment required. We'll design your automation and show you how it works first.
                </p>
              </div>
            )}
          </div>
        </FadeIn>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: "#0F172A", padding: "48px 32px", textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <div aria-hidden="true" style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #0D9488, #14B8A6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 900, fontSize: 15,
          }}>A</div>
          <span style={{ fontWeight: 900, fontSize: 17, color: "white", fontFamily: displayFont }}>AutoFlow</span>
        </div>
        <nav aria-label="Footer navigation" style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
          <a href="#pricing" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "clamp(0.75rem,1.2vw,0.85rem)" }}>Pricing</a>
          <a href="#quote" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "clamp(0.75rem,1.2vw,0.85rem)" }}>Get a Quote</a>
          <a href={DASHBOARD_URL} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "clamp(0.75rem,1.2vw,0.85rem)" }}>Log in</a>
        </nav>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "clamp(0.75rem,1.2vw,0.85rem)", marginBottom: 6 }}>
          Automation services for businesses in the UAE
        </div>
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "clamp(0.7rem,1.1vw,0.78rem)" }}>© 2026 AutoFlow. All rights reserved.</div>
      </footer>
      </main>
    </div>
  );
}
