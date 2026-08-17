import { useState, useEffect, useRef } from "react";

const DASHBOARD_URL = "https://dashboard.autoflow.ivanit.work";
// Webhook URL: move this to VITE_WEBHOOK_URL env var in Cloudflare Pages settings
// then replace the hardcoded string below with: import.meta.env.VITE_WEBHOOK_URL
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
      <h3 style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: -0.5, fontFamily: "'Boska', Georgia, serif" }}>
        How much are no-shows costing you?
      </h3>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>
        Drag the sliders — watch the money you're losing
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
        display: "flex", gap: 12,
      }}>
        <div style={{
          flex: 1, background: "rgba(239,68,68,0.1)", borderRadius: 14, padding: "18px 16px",
          border: "1px solid rgba(239,68,68,0.15)",
        }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>You're losing</div>
          <div style={{ color: "#EF4444", fontSize: 28, fontWeight: 800, marginTop: 4 }}>
            {lostPerMonth.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>AED/mo</span>
          </div>
        </div>
        <div style={{
          flex: 1, background: "rgba(16,185,129,0.1)", borderRadius: 14, padding: "18px 16px",
          border: "1px solid rgba(16,185,129,0.15)",
        }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>We save you</div>
          <div style={{ color: "#10B981", fontSize: 28, fontWeight: 800, marginTop: 4 }}>
            {savedPerMonth.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>AED/mo</span>
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 12, background: "rgba(245,158,11,0.08)", borderRadius: 14, padding: "14px 16px",
        border: "1px solid rgba(245,158,11,0.12)", textAlign: "center",
      }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>That's </span>
        <span style={{ color: "#F59E0B", fontSize: 22, fontWeight: 800 }}>{savedPerYear.toLocaleString()} AED</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}> saved per year</span>
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
          }}>\ud83d\udc88</div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>GlowCuts Salon</div>
            <div style={{ color: "#25D366", fontSize: 10 }}>\u25cf online</div>
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
        padding: highlight ? "44px 28px 36px" : "36px 26px",
        flex: "1 1 260px",
        maxWidth: highlight ? 340 : 300,
        border: highlight ? "1px solid rgba(245,158,11,0.3)" : "1px solid #E2E8F0",
        boxShadow: highlight
          ? hover ? "0 24px 72px rgba(245,158,11,0.25)" : "0 16px 48px rgba(15,23,42,0.35)"
          : hover ? "0 12px 32px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column", gap: 16,
        transform: highlight
          ? hover ? "translateY(-8px) scale(1.02)" : "translateY(-4px) scale(1.01)"
          : hover ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        cursor: "default", position: "relative", zIndex: highlight ? 1 : 0,
      }}
    >
      {badge && (
        <div style={{
          background: "#F59E0B",
          color: "white", fontWeight: 800, fontSize: 10, padding: "5px 14px",
          borderRadius: 20, alignSelf: "flex-start", textTransform: "uppercase", letterSpacing: 1,
        }}>{badge}</div>
      )}
      <div style={{ fontSize: 20, fontWeight: 800, color: highlight ? "white" : "#0F172A", fontFamily: "'Boska', Georgia, serif" }}>{tier}</div>
      <div style={{ fontSize: 13, color: highlight ? "rgba(255,255,255,0.5)" : "#64748B", lineHeight: 1.5 }}>{desc}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 40, fontWeight: 900, color: highlight ? "white" : "#0F172A", letterSpacing: -1, fontFamily: "'Boska', Georgia, serif" }}>{price}</span>
        {price !== "Free" && <span style={{ fontSize: 14, color: highlight ? "rgba(255,255,255,0.4)" : "#94A3B8" }}>/month</span>}
      </div>
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
      <button
        onClick={onCta}
        style={{
          marginTop: "auto", padding: "13px 20px", borderRadius: 12, border: "none",
          background: highlight ? "#F59E0B" : "#0D9488",
          color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer",
          transition: "background 0.2s, transform 0.2s",
          transform: hover ? "scale(1.02)" : "scale(1)",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = highlight ? "#D97706" : "#0f766e"; }}
        onMouseLeave={e => { e.currentTarget.style.background = highlight ? "#F59E0B" : "#0D9488"; }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

// ─── How It Works — Timeline variant ───
function HowItWorksStep({ number, title, desc, last }) {
  return (
    <div style={{ display: "flex", gap: 20, position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "#0D9488", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900, fontSize: 17, fontFamily: "'Boska', Georgia, serif",
          boxShadow: "0 4px 16px rgba(13,148,136,0.3)",
          flexShrink: 0,
        }}>{number}</div>
        {!last && <div style={{ width: 2, flex: 1, background: "linear-gradient(to bottom, #0D9488, rgba(13,148,136,0.1))", marginTop: 8, minHeight: 32 }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : 36, paddingTop: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#0F172A", marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, maxWidth: 360 }}>{desc}</div>
      </div>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const sanitize = (str) => str.replace(/<[^>]*>/g, "").replace(/[<>"'`]/g, "").trim();
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidWhatsApp = (num) => {
    const digits = num.replace(/[\s\-\+\(\)]/g, "");
    return /^\+?[1-9]\d{6,14}$/.test(digits);
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
    if (!form.whatsapp || !isValidWhatsApp(form.whatsapp)) e.whatsapp = "Enter a valid phone number";
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
      setErrors({ submit: "Form submission is not configured. Please contact us directly." });
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
        referrerPolicy: "no-referrer",
        body: JSON.stringify(sanitizedForm),
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: "Something went wrong. Please try again." });
    }
    setSubmitting(false);
  };

  const navLinks = [
    { href: "#calc", label: "Calculator" },
    { href: "#how", label: "How it works" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <div style={{ fontFamily: "'General Sans', 'Inter', system-ui, sans-serif", color: "#334155", background: "#F0F4F8", overflowX: "hidden" }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=boska@400,500,700&f[]=general-sans@400,500,600,700&display=swap');
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
        input:focus, textarea:focus, select:focus { border-color: #0D9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.1); outline: none; }
        a:focus-visible, button:focus-visible { outline: 2px solid #14B8A6; outline-offset: 2px; border-radius: 4px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }
        }
        .nav-link:hover { color: white !important; }
        .login-link:hover { border-color: rgba(255,255,255,0.4) !important; color: white !important; }
        @media (max-width: 640px) {
          .phone-float { animation: none !important; }
          .hero-phone { display: none; }
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .hero-h1 { font-size: clamp(2.2rem, 8vw, 3.2rem) !important; }
        }
        @media (min-width: 641px) {
          .nav-mobile-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
        .hero-h1 { font-size: clamp(2.5rem, 5vw, 3.5rem); }
      `}</style>

      {/* Skip to content */}
      <a href="#main-content" style={{
        position: "absolute", left: "-9999px", top: 0, zIndex: 999,
        background: "#0D9488", color: "white", padding: "8px 16px",
      }} onFocus={e => { e.currentTarget.style.left = "8px"; }} onBlur={e => { e.currentTarget.style.left = "-9999px"; }}>
        Skip to main content
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
          {/* SVG logo mark */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="AutoFlow logo" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="10" fill="url(#logo-grad)" />
            <path d="M11 24 L18 12 L25 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M13.5 20.5 H22.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="26" cy="14" r="3" fill="#F59E0B" />
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0D9488" />
                <stop offset="1" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 18, color: "white", letterSpacing: -0.5, fontFamily: "'Boska', Georgia, serif" }}>AutoFlow</span>
        </div>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="nav-link"
              style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500, fontSize: 13, transition: "color 0.2s" }}>
              {l.label}
            </a>
          ))}
          <a href={DASHBOARD_URL} className="login-link" style={{
            color: "rgba(255,255,255,0.75)", textDecoration: "none", fontWeight: 600, fontSize: 13,
            padding: "8px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
            transition: "all 0.2s",
          }}>Log in</a>
          <a href="#quote" style={{
            background: "#F59E0B",
            color: "white", padding: "9px 20px", borderRadius: 10,
            textDecoration: "none", fontWeight: 700, fontSize: 13,
          }}>Get a Quote</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(o => !o)}
          style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 8 }}
        >
          {mobileMenuOpen
            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          }
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" style={{
          position: "fixed", top: 56, left: 0, right: 0, zIndex: 99,
          background: "rgba(15,23,42,0.98)", backdropFilter: "blur(20px)",
          padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 600, fontSize: 16 }}>
              {l.label}
            </a>
          ))}
          <a href={DASHBOARD_URL} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontWeight: 500, fontSize: 14 }}>Log in</a>
          <a href="#quote" onClick={() => setMobileMenuOpen(false)}
            style={{ background: "#F59E0B", color: "white", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 15, textAlign: "center" }}>
            Get a Quote
          </a>
        </div>
      )}

      <main id="main-content">

      {/* ─── HERO ─── */}
      <section style={{
        background: "#0F172A",
        padding: "120px 32px 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -100, right: -100, width: 500, height: 500,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: "10%", width: 300, height: 300,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "center", gap: 56, position: "relative",
        }}>
          <div style={{ flex: "1 1 420px", maxWidth: 560 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
              padding: "6px 16px", borderRadius: 24, marginBottom: 24,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: "#F59E0B", animation: "dotPulse 2s infinite" }} />
              <span style={{ color: "#F59E0B", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Automation built for UAE businesses
              </span>
            </div>

            <h1 className="hero-h1" style={{
              fontFamily: "'Boska', Georgia, serif",
              fontWeight: 700, color: "white", lineHeight: 1.08,
              letterSpacing: -1, marginBottom: 20,
            }}>
              Put your business on{" "}
              <span style={{
                background: "linear-gradient(135deg, #14B8A6, #F59E0B)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>autopilot.</span>
            </h1>
            <p style={{
              fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.75,
              marginBottom: 36, maxWidth: 480,
            }}>
              Automated reminders, follow-ups, and booking confirmations that run on their own — so you stop chasing customers and start reclaiming your time.
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
              Built for salons, clinics, tutors, and travel agencies in the UAE.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
              <a href="#quote" style={{
                background: "#0D9488",
                color: "white", padding: "16px 32px", borderRadius: 14,
                textDecoration: "none", fontWeight: 700, fontSize: 15,
                boxShadow: "0 8px 32px rgba(13,148,136,0.3)",
                display: "inline-block",
              }}>Request a Free Quote</a>
              <a href="#calc" style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.75)", padding: "16px 28px", borderRadius: 14,
                textDecoration: "none", fontWeight: 600, fontSize: 14,
              }}>Calculate your savings \u2193</a>
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: 13, color: "rgba(255,255,255,0.3)", flexWrap: "wrap" }}>
              <span>\u2736 No setup fees</span>
              <span>\u2736 Works with WhatsApp</span>
              <span>\u2736 Cancel anytime</span>
            </div>
          </div>
          <div className="hero-phone phone-float" style={{ flex: "0 0 auto", animation: "float 6s ease-in-out infinite" }}>
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
              <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.1rem)", fontWeight: 700, color: "white", lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 16, fontFamily: "'Boska', Georgia, serif" }}>
                See exactly how much you're leaving on the table
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                The average appointment business loses 15–30% of revenue to no-shows. Drag the sliders to see your numbers — then let us fix them.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { text: "Every no-show = an empty slot you can't fill" },
                  { text: "Staff calling to confirm = hours wasted weekly" },
                  { text: "Automated reminders cut no-shows by 30% on average" },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0D9488", marginTop: 6, flexShrink: 0 }} />
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <SavingsCalculator />
          </div>
        </FadeIn>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ background: "white", padding: "52px 32px" }}>
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
              <div style={{ fontSize: 42, fontWeight: 700, color: "#0F172A", letterSpacing: -1, fontFamily: "'Boska', Georgia, serif" }}>
                {s.n === 0 ? "0" : <Counter target={s.n} />}{s.s}
              </div>
              <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS — Timeline ─── */}
      <section id="how" style={{ padding: "80px 32px", background: "#F8FAFC" }}>
        <FadeIn>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ marginBottom: 52 }}>
              <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, color: "#0F172A", letterSpacing: -0.5, fontFamily: "'Boska', Georgia, serif", marginBottom: 8 }}>How it works</h2>
              <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.6 }}>
                From booking to confirmation — fully automated, no manual work on your end.
              </p>
            </div>
            {[
              { title: "Customer books", desc: "Via your form, phone, Instagram, or walk-in. We connect to however you take bookings today — no new software needed on your side." },
              { title: "Flow triggers instantly", desc: "Our automation engine picks it up with no delay and no manual entry. It works around the clock, even when you're with another client." },
              { title: "Reminders go out automatically", desc: "WhatsApp or SMS, 24h and 2h before the appointment. The customer confirms or reschedules right in the chat." },
              { title: "Everything logged for you", desc: "Your dashboard shows confirmed, pending, and no-shows at a glance. Know your day before it starts.", last: true },
            ].map((step, i) => (
              <HowItWorksStep key={i} number={i + 1} title={step.title} desc={step.desc} last={step.last} />
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ─── USE CASES ─── */}
      <section style={{ padding: "72px 32px", background: "white" }}>
        <FadeIn>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: "clamp(1.4rem,3vw,1.9rem)", fontWeight: 700, color: "#0F172A", letterSpacing: -0.5, marginBottom: 8, fontFamily: "'Boska', Georgia, serif" }}>
                Built for businesses like yours
              </h2>
              <p style={{ color: "#64748B", fontSize: 15, maxWidth: 440 }}>
                If people book time with you, we make sure they show up.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {[
                { icon: "\ud83d\udc87", title: "Salons", stat: "28%", desc: "average no-show rate in UAE salons. Reminders cut that to under 10%." },
                { icon: "\ud83c\udfe5", title: "Clinics", stat: "4 hrs", desc: "per week staff spend calling patients to confirm. Zero with automation." },
                { icon: "\ud83d\udcda", title: "Tutors", stat: "3\u00d7", desc: "more rebookings when students get a follow-up after their session." },
                { icon: "\ud83d\udc85", title: "Spas", stat: "AED 600+", desc: "average revenue recovered per month from prevented no-shows." },
                { icon: "\u2708\ufe0f", title: "Travel", stat: "92%", desc: "of travelers appreciate pre-trip reminders (visa, docs, check-in)." },
              ].map((c, i) => (
                <div key={i} style={{
                  background: "#F8FAFC", borderRadius: 16, padding: "24px 20px",
                  flex: "1 1 170px", maxWidth: 200,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#0D9488", marginBottom: 6, fontFamily: "'Boska', Georgia, serif" }}>{c.stat}</div>
                  <div style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.55 }}>{c.desc}</div>
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
            <div style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, color: "#0F172A", letterSpacing: -0.5, fontFamily: "'Boska', Georgia, serif", marginBottom: 8 }}>Simple, honest pricing</h2>
              <p style={{ color: "#64748B", fontSize: 15 }}>Start free. Upgrade when the ROI is obvious.</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
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
            <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 28 }}>
              Already a customer? <a href={DASHBOARD_URL} style={{ color: "#0D9488", fontWeight: 700, textDecoration: "none" }}>Log in to your dashboard \u2192</a>
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ─── SECURITY TRUST BLOCK ─── */}
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
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: "white", marginBottom: 6, fontFamily: "'Boska', Georgia, serif" }}>
                Built security-first, from the ground up
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                Every account is fully isolated — one business can never see another's data, credentials, or automations. Access is enforced at the server, not just hidden in the interface. We run continuous security monitoring across our infrastructure so your customers' details stay yours alone.
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
              <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, color: "#0F172A", letterSpacing: -0.5, fontFamily: "'Boska', Georgia, serif", marginBottom: 8 }}>
                Get your free automation plan
              </h2>
              <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.6 }}>
                Tell us about your business — we'll design your first flow and set it up for free.
              </p>
            </div>
            {submitted ? (
              <div style={{
                background: "#F0FDF4", borderRadius: 20, padding: "56px 32px",
                textAlign: "center", border: "1px solid #BBF7D0",
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>\ud83c\udf89</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 8, fontFamily: "'Boska', Georgia, serif" }}>
                  You're in!
                </div>
                <div style={{ color: "#64748B", fontSize: 14, lineHeight: 1.6 }}>
                  We'll reach out on WhatsApp within 24 hours with your custom automation plan. No payment needed to start.
                </div>
              </div>
            ) : (
              <div style={{
                background: "#F8FAFC", borderRadius: 20, padding: "36px 28px",
                border: "1px solid rgba(0,0,0,0.07)",
              }}>
                {errors.submit && (
                  <div role="alert" style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: "#DC2626", fontSize: 13 }}>
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
                      <label htmlFor={`field-${f.key}`} style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.3 }}>
                        {f.label}
                      </label>
                      <input
                        id={`field-${f.key}`}
                        type={f.type}
                        placeholder={f.ph}
                        value={form[f.key]}
                        maxLength={f.maxLen}
                        onChange={e => handleInputChange(f.key, e.target.value)}
                        aria-describedby={errors[f.key] ? `err-${f.key}` : undefined}
                        aria-invalid={!!errors[f.key]}
                        style={{
                          width: "100%", padding: "12px 14px", borderRadius: 10,
                          border: errors[f.key] ? "1px solid #EF4444" : "1px solid #E2E8F0",
                          fontSize: 14, fontFamily: "inherit", background: "white",
                          transition: "all 0.2s",
                        }}
                      />
                      {errors[f.key] && (
                        <p id={`err-${f.key}`} role="alert" style={{ color: "#EF4444", fontSize: 11, marginTop: 4 }}>{errors[f.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <fieldset style={{ border: "none", padding: 0 }}>
                    <legend style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.3, display: "block" }}>
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
                            padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                            border: form.type === t ? "2px solid #0D9488" : errors.type ? "1px solid #EF4444" : "1px solid #E2E8F0",
                            background: form.type === t ? "rgba(13,148,136,0.08)" : "white",
                            color: form.type === t ? "#0D9488" : "#64748B",
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                        >{t}</button>
                      ))}
                    </div>
                    {errors.type && (
                      <p role="alert" style={{ color: "#EF4444", fontSize: 11, marginTop: 4 }}>{errors.type}</p>
                    )}
                  </fieldset>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="field-message" style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.3 }}>
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
                      border: "1px solid #E2E8F0", fontSize: 14,
                      fontFamily: "inherit", resize: "vertical", background: "white",
                      transition: "all 0.2s",
                    }}
                  />
                  <p style={{ textAlign: "right", fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
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
                    color: "white", fontWeight: 700, fontSize: 16,
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: submitting ? "none" : "0 8px 32px rgba(13,148,136,0.25)",
                    transition: "all 0.2s",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit — It's Free"}
                </button>
                <p style={{ textAlign: "center", fontSize: 12, color: "#94A3B8", marginTop: 10 }}>
                  No payment required. We'll design your automation and show you how it works first.
                </p>
              </div>
            )}
          </div>
        </FadeIn>
      </section>

      </main>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: "#0F172A", padding: "48px 32px", textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="10" fill="url(#footer-logo-grad)" />
            <path d="M11 24 L18 12 L25 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M13.5 20.5 H22.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="26" cy="14" r="3" fill="#F59E0B" />
            <defs>
              <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0D9488" />
                <stop offset="1" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 16, color: "white", fontFamily: "'Boska', Georgia, serif" }}>AutoFlow</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 20, flexWrap: "wrap" }}>
          <a href="#pricing" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>Pricing</a>
          <a href="#quote" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>Get a Quote</a>
          <a href={DASHBOARD_URL} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>Log in</a>
        </div>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, marginBottom: 4 }}>
          Automation services for businesses in the UAE
        </div>
        <div style={{ color: "rgba(255,255,255,0.15)", fontSize: 12 }}>\u00a9 2026 AutoFlow. All rights reserved.</div>
      </footer>
    </div>
  );
}
