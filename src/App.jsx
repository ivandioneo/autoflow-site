import { useState, useEffect, useRef } from "react";

const DASHBOARD_URL = "https://dashboard.autoflow.ivanit.work";
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

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
      <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: "white", fontSize: "clamp(1.25rem,2vw,1.5rem)", fontWeight: 400, marginBottom: 4, letterSpacing: -0.3, fontStyle: "italic" }}>
        How much are no-shows costing you?
      </h3>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.75rem,1.5vw,0.8125rem)", marginBottom: 28 }}>
        Drag the sliders — watch the money you're losing
      </p>

      {[
        { label: "Bookings per week", value: bookingsPerWeek, set: setBookingsPerWeek, min: 5, max: 100, unit: "" },
        { label: "Average booking price", value: avgPrice, set: setAvgPrice, min: 30, max: 500, unit: " AED" },
        { label: "Your no-show rate", value: noShowRate, set: setNoShowRate, min: 5, max: 50, unit: "%" },
      ].map((s, i) => (
        <div key={i} style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.75rem,1.5vw,0.8125rem)", fontWeight: 500 }}>{s.label}</span>
            <span style={{ color: "#F59E0B", fontSize: "clamp(0.875rem,1.5vw,0.9375rem)", fontWeight: 800 }}>
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
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.625rem,1.2vw,0.6875rem)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>You're losing</div>
          <div style={{ color: "#EF4444", fontSize: "clamp(1.5rem,3vw,1.75rem)", fontWeight: 800, marginTop: 4 }}>
            {lostPerMonth.toLocaleString()} <span style={{ fontSize: "clamp(0.75rem,1.5vw,0.875rem)", fontWeight: 600 }}>AED/mo</span>
          </div>
        </div>
        <div style={{
          flex: 1, background: "rgba(16,185,129,0.1)", borderRadius: 14, padding: "18px 16px",
          border: "1px solid rgba(16,185,129,0.15)",
        }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.625rem,1.2vw,0.6875rem)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>We save you</div>
          <div style={{ color: "#10B981", fontSize: "clamp(1.5rem,3vw,1.75rem)", fontWeight: 800, marginTop: 4 }}>
            {savedPerMonth.toLocaleString()} <span style={{ fontSize: "clamp(0.75rem,1.5vw,0.875rem)", fontWeight: 600 }}>AED/mo</span>
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 12, background: "rgba(245,158,11,0.08)", borderRadius: 14, padding: "14px 16px",
        border: "1px solid rgba(245,158,11,0.12)", textAlign: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.75rem,1.5vw,0.75rem)" }}>That's </span>
        <span style={{ color: "#F59E0B", fontSize: "clamp(1.25rem,2.5vw,1.375rem)", fontWeight: 800 }}>{savedPerYear.toLocaleString()} AED</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.75rem,1.5vw,0.75rem)" }}> saved per year</span>
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
        flex: highlight ? "1 1 300px" : "1 1 260px",
        maxWidth: highlight ? 360 : 310,
        border: highlight ? "1px solid rgba(245,158,11,0.3)" : "1px solid #E2E8F0",
        boxShadow: highlight
          ? hover
            ? "0 28px 72px rgba(245,158,11,0.2), 0 0 0 1px rgba(245,158,11,0.18)"
            : "0 16px 48px rgba(15,23,42,0.35), 0 0 0 1px rgba(245,158,11,0.12)"
          : hover ? "0 12px 32px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column", gap: 16,
        transform: highlight
          ? hover ? "translateY(-12px) scale(1.03)" : "translateY(-6px) scale(1.02)"
          : hover ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        cursor: "default",
        position: "relative", zIndex: highlight ? 2 : 1,
      }}
    >
      {badge && (
        <div style={{
          background: "#F59E0B",
          color: "white", fontWeight: 800, fontSize: 10, padding: "5px 14px",
          borderRadius: 20, alignSelf: "flex-start", textTransform: "uppercase", letterSpacing: 1,
        }}>{badge}</div>
      )}
      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.125rem,2vw,1.375rem)", fontWeight: 400, color: highlight ? "white" : "#0F172A", fontStyle: "italic" }}>{tier}</div>
      <div style={{ fontSize: "clamp(0.75rem,1.5vw,0.8125rem)", color: highlight ? "rgba(255,255,255,0.5)" : "#64748B", lineHeight: 1.5 }}>{desc}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: "clamp(2rem,4vw,2.5rem)", fontWeight: 900, color: highlight ? "white" : "#0F172A", letterSpacing: -1 }}>{price}</span>
        {price !== "Free" && <span style={{ fontSize: "clamp(0.75rem,1.5vw,0.875rem)", color: highlight ? "rgba(255,255,255,0.4)" : "#94A3B8" }}>/month</span>}
      </div>
      <div style={{
        borderTop: `1px solid ${highlight ? "rgba(255,255,255,0.08)" : "#F1F5F9"}`,
        paddingTop: 18, display: "flex", flexDirection: "column", gap: 11,
      }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: "clamp(0.75rem,1.5vw,0.8125rem)", color: highlight ? "rgba(255,255,255,0.8)" : "#475569" }}>
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
          background: highlight ? "#F59E0B" : "#0D9488",
          color: "white", fontWeight: 700, fontSize: "clamp(0.8125rem,1.5vw,0.875rem)", cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          transform: hover ? "scale(1.02)" : "scale(1)",
          boxShadow: highlight && hover ? "0 4px 20px rgba(245,158,11,0.4)" : "none",
        }}>
        {ctaLabel}
      </button>
    </div>
  );
}

// ─── Mobile Nav ───
function MobileNav({ scrolled }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        style={{
          display: "none", background: "none", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "white",
          fontSize: 18, lineHeight: 1,
        }}
        className="mobile-menu-btn"
      >{open ? "✕" : "☰"}</button>
      {open && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, background: "rgba(15,23,42,0.97)",
          backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, zIndex: 99,
        }}>
          {[["#calc","Calculator"],["#how","How it works"],["#pricing","Pricing"]].map(([href,label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{
              color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 600, fontSize: 16,
            }}>{label}</a>
          ))}
          <a href={DASHBOARD_URL} onClick={() => setOpen(false)} style={{
            color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 600, fontSize: 15,
          }}>Log in</a>
          <a href="#quote" onClick={() => setOpen(false)} style={{
            background: "#0D9488", color: "white", padding: "12px 20px", borderRadius: 10,
            textDecoration: "none", fontWeight: 700, fontSize: 15, textAlign: "center",
          }}>Get a Quote</a>
        </div>
      )}
    </>
  );
}

// ─── Main Page ───
export default function AutoFlowLanding() {
  const [form, setForm] = useState({ name: "", business: "", email: "", whatsapp: "", type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const sanitize = (str) => str.replace(/<[^>]*>/g, "").replace(/[<>"'`]/g, "").trim();
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // E.164-compliant: optional leading +, then 7-15 digits, no leading zero after country code
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
    if (!form.name || !isValidName(form.name)) e.name = "Enter a valid name (letters only, 2–50 chars)";
    if (!form.business || form.business.trim().length < 2) e.business = "Enter a business name";
    if (!form.email || !isValidEmail(form.email)) e.email = "Enter a valid email address";
    if (!form.whatsapp || !isValidWhatsApp(form.whatsapp)) e.whatsapp = "Enter a valid phone number (7–15 digits, no leading zero)";
    if (!form.type) e.type = "Select a business type";
    if (form.message && form.message.length > 500) e.message = "Message too long (max 500 characters)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    const now = Date.now();
    if (now - lastSubmitRef.current < 10000) return;
    if (!validate()) return;
    if (!WEBHOOK_URL) { setErrors({ submit: "Service unavailable. Please try again later." }); return; }
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
        referrerPolicy: "no-referrer",
        mode: "no-cors",
        body: JSON.stringify(sanitizedForm),
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: "Something went wrong. Please try again." });
    }
    setSubmitting(false);
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#334155", background: "#F0F4F8", overflowX: "hidden" }}>
      <style>{`
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
        .nav-link:hover { color: white !important; }
        .login-link:hover { border-color: rgba(255,255,255,0.4) !important; color: white !important; }
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }
        /* float only runs when motion is acceptable */
        @media (prefers-reduced-motion: no-preference) {
          .hero-phone-float { animation: float 6s ease-in-out infinite; }
        }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .hero-phone { display: none; }
          .hero-title { font-size: clamp(2rem,9vw,3.25rem) !important; }
          .section-pad { padding-left: 18px !important; padding-right: 18px !important; }
        }
        .step-number {
          width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-weight: 900; font-size: 16px; flex-shrink: 0;
        }
        .step-connector {
          width: 2px; height: 40px; background: linear-gradient(to bottom, rgba(13,148,136,0.4), transparent);
          margin-left: 19px;
        }
        /* Use-cases table hover */
        .usecase-row:hover { background: #F1F5F9 !important; }
      `}</style>

      {/* Skip to content */}
      <a href="#main-content" style={{
        position: "absolute", top: -40, left: 8, background: "#0D9488", color: "white",
        padding: "8px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14,
        zIndex: 200, transition: "top 0.2s",
      }} onFocus={e => e.target.style.top = "8px"} onBlur={e => e.target.style.top = "-40px"}>
        Skip to content
      </a>

      {/* ─── NAV ─── */}
      <nav role="navigation" aria-label="Main navigation" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: scrolled ? "12px 32px" : "18px 32px",
        background: scrolled ? "rgba(15,23,42,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg aria-label="AutoFlow logo" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 10 }}>
            <rect width="36" height="36" rx="10" fill="#0D9488"/>
            <path d="M11 25 L18 11 L25 25" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M13.5 20.5 H22.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="26" cy="12" r="3" fill="#F59E0B"/>
          </svg>
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, fontSize: 21, color: "white", letterSpacing: -0.3, fontStyle: "italic" }}>AutoFlow</span>
        </div>
        <div className="desktop-nav" style={{ gap: 24, alignItems: "center" }}>
          <a href="#calc" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, fontSize: 13, transition: "color 0.2s" }}>Calculator</a>
          <a href="#how" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, fontSize: 13, transition: "color 0.2s" }}>How it works</a>
          <a href="#pricing" className="nav-link" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, fontSize: 13, transition: "color 0.2s" }}>Pricing</a>
          <a href={DASHBOARD_URL} className="login-link" style={{
            color: "rgba(255,255,255,0.75)", textDecoration: "none", fontWeight: 600, fontSize: 13,
            padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
            transition: "all 0.2s",
          }}>Log in</a>
          {/* Primary nav CTA: teal only — amber is reserved for the hero CTA */}
          <a href="#quote" style={{
            background: "#0D9488",
            color: "white", padding: "9px 20px", borderRadius: 10,
            textDecoration: "none", fontWeight: 700, fontSize: 13,
            boxShadow: "0 4px 16px rgba(13,148,136,0.3)",
          }}>Get a Quote</a>
        </div>
        <MobileNav scrolled={scrolled} />
      </nav>

      {/* ─── HERO ─── */}
      <section id="main-content" style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F172A 100%)",
        padding: "120px 32px 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -100, right: -100, width: 400, height: 400,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -80, left: -80, width: 300, height: 300,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "center", gap: 56, position: "relative",
        }}>
          <div style={{ flex: "1 1 420px", maxWidth: 540 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.2)",
              padding: "6px 16px", borderRadius: 24, marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: "#0D9488", animation: "dotPulse 2s infinite" }} />
              <span style={{ color: "#5eead4", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Automation built for UAE businesses
              </span>
            </div>

            <h1 className="hero-title" style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(2.25rem,5vw,3.5rem)", fontWeight: 400, color: "white", lineHeight: 1.1,
              letterSpacing: -0.5, marginBottom: 20,
            }}>
              Put your business on{" "}
              <em style={{
                background: "linear-gradient(135deg, #14B8A6, #5eead4)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}>autopilot.</em>
            </h1>
            <p style={{
              fontSize: "clamp(0.9375rem,1.8vw,1.0625rem)", color: "rgba(255,255,255,0.5)", lineHeight: 1.7,
              marginBottom: 32, maxWidth: 440,
            }}>
              Automated reminders, follow-ups, and booking confirmations that run on their own — so you stop chasing customers and start reclaiming your time. Built for salons, clinics, tutors, and travel agencies in the UAE.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
              {/* Amber CTA — one instance only, the primary conversion action */}
              <a href="#quote" style={{
                background: "#F59E0B",
                color: "white", padding: "16px 32px", borderRadius: 14,
                textDecoration: "none", fontWeight: 800, fontSize: "clamp(0.875rem,1.8vw,1rem)",
                boxShadow: "0 8px 32px rgba(245,158,11,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s", display: "inline-block",
              }}>Request a Free Quote</a>
              <a href="#calc" style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "white", padding: "16px 28px", borderRadius: 14,
                textDecoration: "none", fontWeight: 600, fontSize: "clamp(0.875rem,1.8vw,0.9375rem)",
              }}>Calculate Your Savings ↓</a>
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: "clamp(0.75rem,1.4vw,0.8125rem)", color: "rgba(255,255,255,0.35)", flexWrap: "wrap" }}>
              <span>✦ No setup fees</span>
              <span>✦ Works with WhatsApp</span>
              <span>✦ Cancel anytime</span>
            </div>
          </div>
          {/* float class respects prefers-reduced-motion via CSS */}
          <div className="hero-phone hero-phone-float" style={{ flex: "0 0 auto" }}>
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
              <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.75rem,3.5vw,2.25rem)", fontWeight: 400, color: "white", lineHeight: 1.2, letterSpacing: -0.3, marginBottom: 16 }}>
                See exactly how much you're leaving on the table
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.875rem,1.6vw,0.9375rem)", lineHeight: 1.7, marginBottom: 24 }}>
                The average appointment business loses 15–30% of revenue to no-shows. Drag the sliders to see your numbers — then let us fix them.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "📉", text: "Every no-show = an empty slot you can't fill" },
                  { icon: "⏰", text: "Staff calling to confirm = hours wasted weekly" },
                  { icon: "✅", text: "Automated reminders cut no-shows by 30% on average" },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 20 }} role="img" aria-hidden="true">{p.icon}</span>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(0.8125rem,1.5vw,0.875rem)" }}>{p.text}</span>
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
              <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(2rem,4vw,2.625rem)", fontWeight: 400, color: "#0F172A", letterSpacing: -1 }}>
                {s.n === 0 ? "0" : <Counter target={s.n} />}{s.s}
              </div>
              <div style={{ fontSize: "clamp(0.75rem,1.3vw,0.8125rem)", color: "#94A3B8", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS — numbered timeline ─── */}
      <section id="how" style={{ padding: "80px 32px", background: "#F8FAFC" }}>
        <FadeIn>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ marginBottom: 52 }}>
              <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.75rem,3.5vw,2.25rem)", fontWeight: 400, color: "#0F172A", letterSpacing: -0.3 }}>How it works</h2>
              <p style={{ color: "#94A3B8", fontSize: "clamp(0.875rem,1.6vw,0.9375rem)", marginTop: 8 }}>
                From booking to confirmation — fully automated
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { n: "01", title: "Customer books", desc: "Via your form, phone, Instagram, or walk-in. We connect to however you take bookings.", accent: "#0D9488" },
                { n: "02", title: "Flow triggers instantly", desc: "Our automation engine picks it up in seconds — no delay, no manual entry, no chasing.", accent: "#0D9488" },
                { n: "03", title: "Reminders go out automatically", desc: "WhatsApp or SMS, 24 h and 2 h before. The customer confirms or reschedules right in the chat.", accent: "#0D9488" },
                { n: "04", title: "Everything logged to your dashboard", desc: "Confirmed, pending, no-shows. You see the full picture at a glance — zero admin.", accent: "#0D9488" },
              ].map((step, i, arr) => (
                <div key={i}>
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div className="step-number" style={{ background: "rgba(13,148,136,0.08)", color: "#0D9488", border: "1.5px solid rgba(13,148,136,0.25)" }}>{step.n}</div>
                      {i < arr.length - 1 && <div className="step-connector" />}
                    </div>
                    <div style={{ paddingBottom: i < arr.length - 1 ? 32 : 0, paddingTop: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: "clamp(0.9375rem,1.8vw,1.0625rem)", color: "#0F172A", marginBottom: 6 }}>{step.title}</div>
                      <div style={{ fontSize: "clamp(0.8125rem,1.5vw,0.875rem)", color: "#64748B", lineHeight: 1.6, maxWidth: 480 }}>{step.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── USE CASES — left-aligned table layout, no emoji-in-circle cards ─── */}
      <section style={{ padding: "72px 32px", background: "white" }}>
        <FadeIn>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.75rem,3.5vw,2rem)", fontWeight: 400, color: "#0F172A", marginBottom: 8, letterSpacing: -0.3 }}>
              Built for businesses like yours
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "clamp(0.875rem,1.6vw,0.9375rem)", marginBottom: 36 }}>
              If people book time with you, we make sure they show up
            </p>
            <div style={{ display: "flex", flexDirection: "column", borderRadius: 16, overflow: "hidden", border: "1px solid #E2E8F0" }}>
              {[
                { icon: "💇", title: "Salons", stat: "28% no-show rate", desc: "UAE salons average 28% no-shows. Automated reminders cut that to under 10%." },
                { icon: "🏥", title: "Clinics", stat: "4 hrs saved weekly", desc: "Staff spend 4 hours a week calling patients to confirm. Zero with automation." },
                { icon: "📚", title: "Tutors", stat: "3× more rebookings", desc: "Students rebook 3× more often when they get a follow-up after each session." },
                { icon: "💅", title: "Spas & Beauty", stat: "AED 600+ recovered/mo", desc: "Average monthly revenue recovered from no-shows that would have been lost." },
                { icon: "✈️", title: "Travel Agencies", stat: "92% satisfaction", desc: "Travelers value pre-trip reminders for visas, documents, and check-in windows." },
              ].map((c, i, arr) => (
                <div key={i} className="usecase-row" style={{
                  display: "grid", gridTemplateColumns: "40px 1fr 1fr", gap: "0 24px",
                  alignItems: "center", padding: "20px 24px",
                  background: i % 2 === 0 ? "white" : "#F8FAFC",
                  borderBottom: i < arr.length - 1 ? "1px solid #E2E8F0" : "none",
                  transition: "background 0.15s",
                }}>
                  <span style={{ fontSize: 22 }} role="img" aria-hidden="true">{c.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "clamp(0.875rem,1.6vw,0.9375rem)", color: "#0F172A" }}>{c.title}</div>
                    <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(0.875rem,1.8vw,1rem)", color: "#0D9488", fontStyle: "italic", marginTop: 2 }}>{c.stat}</div>
                  </div>
                  <div style={{ fontSize: "clamp(0.75rem,1.4vw,0.8125rem)", color: "#64748B", lineHeight: 1.6 }}>{c.desc}</div>
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
            <div style={{ marginBottom: 44 }}>
              <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.75rem,3.5vw,2.25rem)", fontWeight: 400, color: "#0F172A", letterSpacing: -0.3 }}>Simple, honest pricing</h2>
              <p style={{ color: "#94A3B8", fontSize: "clamp(0.875rem,1.6vw,0.9375rem)", marginTop: 8 }}>Start free. Upgrade when the ROI is obvious.</p>
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
            <p style={{ color: "#94A3B8", fontSize: "clamp(0.75rem,1.3vw,0.8125rem)", marginTop: 28 }}>
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
              width: 56, height: 56, borderRadius: 16,
              background: "rgba(13,148,136,0.12)", display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, fontSize: "clamp(1rem,2vw,1.25rem)", color: "white", marginBottom: 6 }}>
                Built security-first, from the ground up
              </div>
              <div style={{ fontSize: "clamp(0.8125rem,1.5vw,0.8125rem)", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
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
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.75rem,3.5vw,2.25rem)", fontWeight: 400, color: "#0F172A", letterSpacing: -0.3 }}>
                Get your free automation plan
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "clamp(0.875rem,1.6vw,0.9375rem)", marginTop: 8 }}>
                Tell us about your business — we'll design your first flow and set it up for free.
              </p>
            </div>
            {submitted ? (
              <div style={{
                background: "#F0FDF4", borderRadius: 20, padding: "56px 32px",
                textAlign: "center", border: "1px solid #BBF7D0",
              }}>
                <div style={{ fontSize: 56, marginBottom: 16 }} role="img" aria-label="Celebration">🎉</div>
                <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(1.25rem,2.5vw,1.5rem)", fontWeight: 400, color: "#0F172A", marginBottom: 8 }}>
                  You're in!
                </div>
                <div style={{ color: "#64748B", fontSize: "clamp(0.8125rem,1.5vw,0.875rem)", lineHeight: 1.6 }}>
                  We'll reach out on WhatsApp within 24 hours with your custom automation plan. No payment needed to start.
                </div>
              </div>
            ) : (
              <div style={{
                background: "#F8FAFC", borderRadius: 20, padding: "36px 28px",
                border: "1px solid #E2E8F0",
              }}>
                {errors.submit && (
                  <div role="alert" style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: "#DC2626", fontSize: "clamp(0.75rem,1.4vw,0.8125rem)" }}>
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
                      <label htmlFor={`field-${f.key}`} style={{ fontSize: "clamp(0.6875rem,1.3vw,0.75rem)", fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.3 }}>
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
                        aria-describedby={errors[f.key] ? `error-${f.key}` : undefined}
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: 10,
                          border: errors[f.key] ? "1px solid #EF4444" : "1px solid #E2E8F0",
                          fontSize: "clamp(0.8125rem,1.5vw,0.875rem)", outline: "none",
                          fontFamily: "inherit", background: "white", transition: "all 0.2s",
                        }}
                      />
                      {errors[f.key] && (
                        <p id={`error-${f.key}`} role="alert" style={{ color: "#EF4444", fontSize: "clamp(0.625rem,1.2vw,0.6875rem)", marginTop: 4 }}>{errors[f.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <fieldset style={{ border: "none", padding: 0 }}>
                    <legend style={{ fontSize: "clamp(0.6875rem,1.3vw,0.75rem)", fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.3 }}>
                      Business type
                    </legend>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {["Salon", "Clinic", "Tutor", "Spa", "Travel", "Other"].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setForm(prev => ({ ...prev, type: t })); if (errors.type) setErrors(prev => ({ ...prev, type: null })); }}
                          aria-pressed={form.type === t}
                          style={{
                            padding: "8px 16px", borderRadius: 10, fontSize: "clamp(0.75rem,1.4vw,0.8125rem)", fontWeight: 600,
                            border: form.type === t ? "2px solid #0D9488" : errors.type ? "1px solid #EF4444" : "1px solid #E2E8F0",
                            background: form.type === t ? "rgba(13,148,136,0.08)" : "white",
                            color: form.type === t ? "#0D9488" : "#64748B",
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                        >{t}</button>
                      ))}
                    </div>
                    {errors.type && (
                      <p role="alert" style={{ color: "#EF4444", fontSize: "clamp(0.625rem,1.2vw,0.6875rem)", marginTop: 4 }}>{errors.type}</p>
                    )}
                  </fieldset>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="field-message" style={{ fontSize: "clamp(0.6875rem,1.3vw,0.75rem)", fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.3 }}>
                    What do you need automated?
                  </label>
                  <textarea
                    id="field-message"
                    placeholder="e.g. appointment reminders, follow-ups, booking confirmations..."
                    value={form.message} rows={3}
                    maxLength={500}
                    onChange={e => handleInputChange("message", e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 10,
                      border: "1px solid #E2E8F0", fontSize: "clamp(0.8125rem,1.5vw,0.875rem)", outline: "none",
                      fontFamily: "inherit", resize: "vertical", background: "white",
                      transition: "all 0.2s",
                    }}
                  />
                  <p style={{ textAlign: "right", fontSize: "clamp(0.625rem,1.2vw,0.6875rem)", color: "#94A3B8", marginTop: 2 }}>
                    {form.message.length}/500
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%", padding: "16px", borderRadius: 14, border: "none",
                    background: submitting ? "#94A3B8" : "#0D9488",
                    color: "white", fontWeight: 800, fontSize: "clamp(0.9375rem,1.8vw,1rem)",
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: submitting ? "none" : "0 8px 32px rgba(13,148,136,0.3)",
                    transition: "all 0.2s",
                  }}
                >
                  {submitting ? "Submitting…" : "Submit — It's Free"}
                </button>
                <p style={{ textAlign: "center", fontSize: "clamp(0.625rem,1.2vw,0.6875rem)", color: "#94A3B8", marginTop: 10 }}>
                  No payment required. We'll design your automation and show you how it works first.
                </p>
              </div>
            )}
          </div>
        </FadeIn>
      </section>

      {/* ─── FOOTER ─── */}
      <footer role="contentinfo" style={{
        background: "#0F172A", padding: "48px 32px", textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 8 }}>
            <rect width="36" height="36" rx="10" fill="#0D9488"/>
            <path d="M11 25 L18 11 L25 25" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M13.5 20.5 H22.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="26" cy="12" r="3" fill="#F59E0B"/>
          </svg>
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, fontSize: 19, color: "white", fontStyle: "italic" }}>AutoFlow</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
          <a href="#pricing" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "clamp(0.75rem,1.4vw,0.8125rem)" }}>Pricing</a>
          <a href="#quote" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "clamp(0.75rem,1.4vw,0.8125rem)" }}>Get a Quote</a>
          <a href={DASHBOARD_URL} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "clamp(0.75rem,1.4vw,0.8125rem)" }}>Log in</a>
        </div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "clamp(0.75rem,1.4vw,0.8125rem)", marginBottom: 6 }}>
          Automation services for businesses in the UAE
        </div>
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "clamp(0.625rem,1.2vw,0.75rem)" }}>© 2026 AutoFlow. All rights reserved.</div>
      </footer>
    </div>
  );
}
