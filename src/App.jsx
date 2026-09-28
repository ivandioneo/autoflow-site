import { useState, useEffect, useRef } from "react";

const DASHBOARD_URL = "https://dashboard.autoflow.ivanit.work";
function AutoFlowLogo({ compact = false, monochrome = false }) {
  const id = compact ? "afLogoCompact" : "afLogo";
  return (
    <span className={compact ? "af-logo af-logo--compact" : "af-logo"} aria-label="AutoFlow">
      <svg className="af-logo-mark" viewBox="0 0 120 100" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={id + "Blue"} x1="18" y1="78" x2="94" y2="15" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={monochrome ? "#FFFFFF" : "#1687FF"} />
            <stop offset="0.55" stopColor={monochrome ? "#FFFFFF" : "#00C8FF"} />
            <stop offset="1" stopColor={monochrome ? "#FFFFFF" : "#49D7FF"} />
          </linearGradient>
        </defs>
        <path d="M18 77 42 18c2-5 6-8 12-8h11l30 67c2 5-1 9-7 9H74L54 38 40 72c-2 5-7 8-13 8H22c-5 0-6-2-4-3Z" fill={"url(#" + id + "Blue)"} />
        <path d="M8 58h43M15 46h31M25 34h21" stroke={monochrome ? "#FFFFFF" : "#00C8FF"} strokeWidth="8" strokeLinecap="round" />
        <circle cx="5" cy="58" r="4" fill={monochrome ? "#FFFFFF" : "#00C8FF"} />
        <path d="M47 18c13 4 24 13 31 25" stroke={monochrome ? "#FFFFFF" : "#1687FF"} strokeWidth="7" strokeLinecap="round" opacity=".9" />
      </svg>
      {!compact && (
        <span className="af-logo-type"><span>Auto</span><strong>Flow</strong></span>
      )}
    </span>
  );
}


function scrollToQuote() {
  const el = document.getElementById("quote");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ─── Savings Calculator (the wow factor) ───
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
      <h3 style={{ color: "white", fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: -0.5 }}>
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
        borderRadius: 20, padding: "36px 26px", flex: "1 1 260px", maxWidth: 320,
        border: highlight ? "1px solid rgba(245,158,11,0.3)" : "1px solid #1d3b59",
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
      <div style={{ fontSize: 13, color: highlight ? "rgba(255,255,255,0.5)" : "#64748B", lineHeight: 1.5 }}>{desc}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 40, fontWeight: 900, color: highlight ? "white" : "#0F172A", letterSpacing: -1 }}>{price}</span>
        {price !== "Free" && <span style={{ fontSize: 14, color: highlight ? "rgba(255,255,255,0.4)" : "#94A3B8" }}>/month</span>}
      </div>
      <div style={{
        borderTop: `1px solid ${highlight ? "rgba(255,255,255,0.08)" : "#142a40"}`,
        paddingTop: 18, display: "flex", flexDirection: "column", gap: 11,
      }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: highlight ? "rgba(255,255,255,0.8)" : "#475569" }}>
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
            : "#1687ff",
          color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer",
          transition: "transform 0.2s",
          transform: hover ? "scale(1.02)" : "scale(1)",
        }}>
        {ctaLabel}
      </button>
    </div>
  );
}

// ─── Interactive Dashboard Preview ───
function AutomationFlowMockup() {
  const steps = [
    { icon: "📅", title: "Booking received", text: "Customer books", cls: "af-flow-blue" },
    { icon: "✓", title: "Confirmation", text: "Sent automatically", cls: "af-flow-cyan" },
    { icon: "⏰", title: "Reminder", text: "Scheduled before visit", cls: "af-flow-green" },
    { icon: "↻", title: "Follow-up", text: "Runs after booking", cls: "af-flow-purple" },
  ];
  return <div className="af-automation-visual"><div className="af-automation-glow" /><div className="af-flow-card">
    <div className="af-flow-card-head"><div><small>AutoFlow automation</small><strong>Booking workflow</strong></div><span className="af-flow-status"><i /> Active</span></div>
    <div className="af-flow-track">{steps.map((step,i)=><div className="af-flow-step-wrap" key={step.title}><div className={"af-flow-step "+step.cls}><span className="af-flow-icon">{step.icon}</span><div><strong>{step.title}</strong><small>{step.text}</small></div></div>{i<steps.length-1&&<div className="af-flow-connector"><span /></div>}</div>)}</div>
    <div className="af-flow-result"><span>⚡</span><div><strong>Runs automatically</strong><small>No manual chasing required</small></div><b>LIVE</b></div>
  </div></div>;
}

function DashboardMockup() {
  const [active,setActive]=useState("bookings");
  const tabs=[{key:"bookings",label:"Bookings"},{key:"customers",label:"Customers"},{key:"automations",label:"Automations"}];
  return <div className="af-hero-visual"><div className="af-dashboard-glow" /><div className="af-dashboard">
    <div className="af-dashboard-top"><div className="af-window-dots"><i/><i/><i/></div><div className="af-dashboard-brand"><AutoFlowLogo compact /></div><div className="af-live">● Live</div></div>
    <div className="af-dashboard-body"><aside className="af-dashboard-sidebar"><div className="af-side-item active">⌂ <span>Dashboard</span></div>
      {tabs.map(t=><button key={t.key} className={active===t.key?"af-side-item active":"af-side-item"} onClick={()=>setActive(t.key)} type="button">{t.key==="bookings"?"▣":t.key==="customers"?"♙":"⚡"} <span>{t.label}</span></button>)}<div className="af-side-item">⚙ <span>Settings</span></div>
    </aside><div className="af-dashboard-main"><div className="af-dashboard-heading"><div><small>Monday, June 16</small><h3>{active==="bookings"?"Bookings":active==="customers"?"Customers":"Automation flows"}</h3></div><button className="af-mini-cta" type="button">+ New</button></div>
      {active==="bookings"&&<div className="af-calendar">{["Mon 10","Tue 11","Wed 12","Thu 13"].map((d,i)=><div className="af-day" key={d}><strong>{d}</strong><div className="af-event blue" style={{marginTop:28}}>Haircut<br/><small>10:00</small></div>{i===1&&<div className="af-event purple">Hair Color<br/><small>11:30</small></div>}{i===2&&<div className="af-event green">Treatment<br/><small>14:00</small></div>}</div>)}</div>}
      {active==="customers"&&<div className="af-data-list">{["Sarah Lim","Jane Doe","Mike Tan","Anna Lee"].map((n,i)=><div className="af-data-row" key={n}><span className="af-avatar">{n[0]}</span><span>{n}<small>{i%2?"Returning customer":"New customer"}</small></span><b>{i+2} visits</b></div>)}</div>}
      {active==="automations"&&<div className="af-flow-preview"><div className="af-flow-node">📅 Customer books</div><span>↓</span><div className="af-flow-node blue-node">✓ Confirmation sent</div><span>↓</span><div className="af-flow-node green-node">⏰ Reminder scheduled</div><span>↓</span><div className="af-flow-node purple-node">↻ Follow-up triggered</div></div>}
    </div></div></div><AutomationFlowMockup /></div>;
}
// ─── Main Page ───
export default function AutoFlowLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="autoflow-dark-site" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#dce7f3", background: "#06111f", overflowX: "hidden" }}>
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
        a:focus-visible, button:focus-visible { outline: 2px solid #00c8ff; outline-offset: 2px; }
        /* AutoFlow dark landing-page system */
        ::selection { background: rgba(22,135,255,0.35); color: #fff; }
        input::placeholder, textarea::placeholder { color: #7187a0; }
                @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }
        }
        .nav-link:hover { color: white !important; }
        .login-link:hover { border-color: rgba(255,255,255,0.4) !important; color: white !important; }
        .af-automation-visual { position:absolute; right:-28px; bottom:-36px; width:360px; z-index:4; animation:float 5s ease-in-out infinite; }
        .af-automation-glow { position:absolute; inset:10% 0 0; background:radial-gradient(circle,rgba(0,200,255,.22),transparent 68%); filter:blur(30px); }
        .af-flow-card { position:relative; background:rgba(7,20,37,.94); border:1px solid rgba(0,200,255,.18); border-radius:22px; padding:20px; box-shadow:0 26px 70px rgba(0,0,0,.42),0 0 35px rgba(0,140,255,.12); backdrop-filter:blur(16px); }
        .af-flow-card-head { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:18px; }.af-flow-card-head small,.af-flow-step small,.af-flow-result small { display:block; color:#7187a0; font-size:10px; margin-top:3px; }.af-flow-card-head strong { display:block; color:#fff; font-size:14px; }
        .af-flow-status { color:#43e6a0; font-size:10px; font-weight:800; padding:6px 9px; border-radius:99px; background:rgba(67,230,160,.08); border:1px solid rgba(67,230,160,.16); }.af-flow-status i { display:inline-block; width:6px; height:6px; border-radius:50%; background:#43e6a0; margin-right:5px; box-shadow:0 0 8px #43e6a0; }
        .af-flow-step { display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:13px; background:rgba(255,255,255,.035); border:1px solid rgba(255,255,255,.07); }.af-flow-step strong { display:block; color:#eaf4ff; font-size:12px; }.af-flow-icon { width:31px; height:31px; display:grid; place-items:center; border-radius:9px; font-size:14px; background:rgba(22,135,255,.13); }.af-flow-cyan .af-flow-icon{background:rgba(0,200,255,.12)}.af-flow-green .af-flow-icon{background:rgba(67,230,160,.12)}.af-flow-purple .af-flow-icon{background:rgba(139,92,246,.13)}
        .af-flow-connector { height:17px; position:relative; }.af-flow-connector:before { content:""; position:absolute; left:27px; top:0; bottom:0; border-left:1px dashed rgba(0,200,255,.28); }.af-flow-connector span { position:absolute; width:6px; height:6px; border-radius:50%; background:#00c8ff; left:24px; top:5px; box-shadow:0 0 10px #00c8ff; animation:flowPulse 1.8s ease-in-out infinite; }
        .af-flow-result { display:flex; align-items:center; gap:10px; margin-top:16px; padding:10px 12px; border-radius:12px; background:linear-gradient(90deg,rgba(22,135,255,.1),rgba(67,230,160,.07)); border:1px solid rgba(0,200,255,.1); }.af-flow-result > span{font-size:17px}.af-flow-result strong{display:block;color:#fff;font-size:11px}.af-flow-result b{margin-left:auto;color:#43e6a0;font-size:9px;letter-spacing:1px}
        @keyframes flowPulse { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(8px);opacity:1} }
        .af-feature-strip { display:flex; gap:12px; padding:12px max(24px,calc((100vw - 1240px)/2)); background:#0b1a2c; border-top:1px solid rgba(255,255,255,.04); border-bottom:1px solid rgba(255,255,255,.05); overflow-x:auto; }.af-feature-card{min-width:205px;flex:1;display:flex;align-items:center;gap:11px;padding:13px 14px;border-radius:13px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.045)}.af-feature-icon{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;color:#fff;font-weight:800;background:rgba(22,135,255,.15)}.af-feature-icon-1{background:rgba(0,200,255,.12);color:#00c8ff}.af-feature-icon-2{background:rgba(139,92,246,.13);color:#b69cff}.af-feature-icon-3{background:rgba(67,230,160,.12);color:#43e6a0}.af-feature-icon-4{background:rgba(245,158,11,.12);color:#f5b84a}.af-feature-card strong{display:block;color:#eaf4ff;font-size:11px}.af-feature-card small{display:block;color:#7187a0;font-size:9px;margin-top:3px}
        .af-nav { display:flex; justify-content:space-between; align-items:center; padding:16px 32px; background:rgba(6,17,31,.72); backdrop-filter:blur(18px); position:fixed; inset:0 0 auto 0; z-index:100; border-bottom:1px solid rgba(255,255,255,.06); transition:all .25s ease; }
        .af-nav.af-nav-scrolled { background:rgba(6,17,31,.96); padding-top:11px; padding-bottom:11px; }
        .af-brand { display:flex; align-items:center; color:#fff; text-decoration:none; }
        .af-logo { display:inline-flex; align-items:center; gap:11px; }
        .af-logo-mark { width:50px; height:42px; display:block; flex:0 0 auto; filter:drop-shadow(0 7px 18px rgba(0,170,255,.2)); }
        .af-logo-type { display:inline-flex; align-items:baseline; font-size:25px; line-height:1; font-weight:900; letter-spacing:-1.25px; color:#fff; }
        .af-logo-type strong { font-weight:900; background:linear-gradient(135deg,#1687ff,#00c8ff); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .af-logo--compact { gap:0; }
        .af-logo--compact .af-logo-mark { width:21px; height:18px; filter:none; }
        .af-logo--compact .af-logo-type { display:none; }
        .af-dashboard-brand { display:flex; align-items:center; flex:1; }
        .af-nav-links { display:flex; align-items:center; gap:24px; }
        .af-nav-links a { color:rgba(255,255,255,.68); text-decoration:none; font-weight:600; font-size:13px; transition:color .2s,background .2s,border .2s; }
        .af-nav-links a:hover { color:#fff; }
        .af-nav-links .af-login { padding:9px 15px; border:1px solid rgba(255,255,255,.16); border-radius:10px; }
        .af-nav-links .af-nav-cta { color:#fff; padding:10px 17px; border-radius:11px; background:linear-gradient(135deg,#1687ff,#00c8ff); box-shadow:0 7px 24px rgba(22,135,255,.25); }
        .af-menu-btn { display:none; width:44px; height:44px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.04); border-radius:11px; padding:9px; cursor:pointer; }
        .af-menu-btn span { display:block; height:2px; margin:5px 0; border-radius:2px; background:#fff; }
        .af-hero-visual { position:relative; min-height:500px; display:flex; align-items:center; justify-content:center; padding:18px 0 72px; }
        .af-dashboard-glow { position:absolute; width:460px; height:380px; border-radius:50%; background:radial-gradient(circle,rgba(22,135,255,.22),transparent 68%); filter:blur(28px); }
        .af-dashboard { position:relative; z-index:2; width:min(560px,100%); border:1px solid rgba(255,255,255,.13); border-radius:18px; overflow:hidden; background:#081525; box-shadow:0 28px 80px rgba(0,0,0,.48),0 0 60px rgba(0,140,255,.09); transform:perspective(1100px) rotateY(-4deg); }
        .af-dashboard-top { height:44px; display:flex; align-items:center; gap:14px; padding:0 14px; border-bottom:1px solid rgba(255,255,255,.08); background:#0b1a2c; }
        .af-window-dots { display:flex; gap:5px; }.af-window-dots i { width:7px;height:7px;border-radius:50%;background:#34516c;display:block; }
        .af-dashboard-brand { color:#eaf4ff; font-size:11px; font-weight:800; flex:1; display:flex; align-items:center; gap:5px; }
        .af-live { color:#19d98a; font-size:10px; font-weight:700; }
        .af-dashboard-body { display:flex; min-height:330px; }
        .af-dashboard-sidebar { width:125px; padding:14px 9px; background:#071321; border-right:1px solid rgba(255,255,255,.06); }
        .af-side-item { width:100%; border:0; background:none; color:#7088a1; display:flex; gap:8px; align-items:center; padding:9px 7px; border-radius:7px; font-size:10px; cursor:pointer; text-align:left; margin-bottom:4px; }
        .af-side-item.active { color:#fff; background:rgba(22,135,255,.13); }.af-side-item:hover { color:#fff; }
        .af-dashboard-main { flex:1; min-width:0; padding:18px; }.af-dashboard-heading { display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; }.af-dashboard-heading small { color:#7187a0; font-size:9px; }.af-dashboard-heading h3 { color:#f5f9ff; font-size:18px; margin-top:3px; }
        .af-mini-cta { border:0; color:#fff; background:#1687ff; border-radius:7px; padding:7px 10px; font-size:9px; cursor:pointer; }
        .af-calendar { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; }.af-day { min-height:235px; border:1px solid #1d3b59; border-radius:8px; padding:8px; background:#0b1a2c; }.af-day strong { color:#91a7bd; font-size:9px; }
        .af-event { margin-top:8px; padding:8px 6px; border-radius:6px; color:#fff; font-size:9px; line-height:1.35; }.af-event small { color:rgba(255,255,255,.55); }.af-event.blue{background:rgba(22,135,255,.26);border-left:2px solid #1687ff}.af-event.purple{background:rgba(139,92,246,.24);border-left:2px solid #8b5cf6}.af-event.green{background:rgba(25,217,138,.18);border-left:2px solid #19d98a}
        .af-data-list { display:flex; flex-direction:column; gap:8px; }.af-data-row { display:flex; align-items:center; gap:10px; padding:11px; border:1px solid #1d3b59; border-radius:9px; color:#dce7f3; font-size:11px; }.af-data-row span:nth-child(2){flex:1}.af-data-row small{display:block;color:#7187a0;margin-top:3px}.af-data-row b{color:#19d98a;font-size:10px}.af-avatar{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#143a62;color:#6fc4ff;font-weight:800}
        .af-flow-preview { display:flex; flex-direction:column; align-items:center; gap:7px; padding:15px; }.af-flow-node { width:80%; padding:13px; text-align:center; border:1px solid #315474; border-radius:9px; background:#10243a; color:#dce7f3; font-size:11px; }.af-flow-node.blue-node{border-color:#1687ff}.af-flow-node.green-node{border-color:#19d98a}
        .af-phone-mini { position:absolute; z-index:3; right:-28px; bottom:-34px; transform:scale(.58); transform-origin:bottom right; filter:drop-shadow(0 20px 30px rgba(0,0,0,.5)); }
        .af-footer .af-logo-mark { width:40px; height:34px; }
        .af-footer .af-logo-type { font-size:21px; }
        @media (max-width: 900px) {
          .af-automation-visual { position:absolute; right:10px; bottom:12px; width:340px; margin:0; animation:none; } .af-flow-card { padding:16px; }
          .af-nav { padding:12px 18px; }.af-logo-mark { width:46px; height:39px; }.af-logo-type { font-size:22px; }.af-nav-links { position:absolute; top:66px; left:12px; right:12px; display:none; flex-direction:column; align-items:stretch; gap:4px; padding:12px; background:rgba(7,19,33,.98); border:1px solid rgba(255,255,255,.1); border-radius:14px; box-shadow:0 20px 50px rgba(0,0,0,.45); }.af-nav-links.open { display:flex; }.af-nav-links a { padding:12px 13px; border-radius:9px; }.af-nav-links .af-nav-cta { text-align:center; }.af-menu-btn { display:block; }
          .af-hero-visual { min-height:500px; margin-top:10px; padding-bottom:20px; }.af-dashboard { transform:none; }.af-phone-mini { display:none; }
        }
        @media (max-width: 620px) {
          .af-hero-visual { min-height:520px; margin-left:-4px; margin-right:-4px; }.af-dashboard-sidebar { display:none; }.af-dashboard { width:100%; }.af-dashboard-body { min-height:280px; }.af-calendar { gap:4px; }.af-day { min-height:190px; padding:5px; }.af-event { font-size:8px; padding:6px 4px; }
          .af-automation-visual { position:absolute; right:4px; bottom:8px; width:calc(100% - 18px); margin:0; } .af-flow-card { padding:13px; border-radius:17px; } .af-flow-step { padding:8px 9px; gap:9px; } .af-flow-step strong { font-size:10px; } .af-flow-step small { font-size:8px; } .af-flow-icon { width:26px; height:26px; font-size:12px; } .af-flow-result { margin-top:10px; padding:8px 10px; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav className={"af-nav " + (scrolled ? "af-nav-scrolled" : "")}>
        <a href="#" className="af-brand" aria-label="AutoFlow home"><AutoFlowLogo /></a>
        <div className={"af-nav-links " + (mobileNavOpen ? "open" : "")}>
          <a href="#how" onClick={() => setMobileNavOpen(false)}>How it works</a>
          <a href="#industries" onClick={() => setMobileNavOpen(false)}>Industries</a>
          <a href="#calc" onClick={() => setMobileNavOpen(false)}>Calculator</a>
          <a href="#pricing" onClick={() => setMobileNavOpen(false)}>Pricing</a>
          <a href={DASHBOARD_URL} className="af-login">Log in</a>
          <a href={DASHBOARD_URL} className="af-nav-cta" onClick={() => setMobileNavOpen(false)}>Open AutoFlow →</a>
        </div>
        <button className="af-menu-btn" type="button" aria-label={mobileNavOpen ? "Close menu" : "Open menu"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(v => !v)}><span /><span /><span /></button>
      </nav>
      {/* ─── HERO ─── */}
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
          maxWidth: 1240, margin: "0 auto", display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: 42, position: "relative",
        }}>
          <div style={{ flex: "1 1 420px", maxWidth: 540 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
              padding: "6px 16px", borderRadius: 24, marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: "#F59E0B", animation: "dotPulse 2s infinite" }} />
              <span style={{ color: "#F59E0B", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Automation built for UAE businesses
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(44px, 5.5vw, 68px)", fontWeight: 900, color: "white", lineHeight: 1.02,
              letterSpacing: -1.5, marginBottom: 20,
            }}>
              Your business.<br />
              <span style={{
                background: "linear-gradient(135deg, #1687FF, #00C8FF)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>On autopilot.</span>
            </h1>
            <p style={{
              fontSize: 17, color: "rgba(255,255,255,0.5)", lineHeight: 1.7,
              marginBottom: 32, maxWidth: 440,
            }}>
              Automated bookings, reminders, confirmations, and follow-ups that keep moving without manual work. Built to help small businesses save time and keep customers coming back.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
              <a href="#how" style={{
                background: "linear-gradient(135deg, #1687ff, #00c8ff)",
                color: "white", padding: "16px 32px", borderRadius: 14,
                textDecoration: "none", fontWeight: 800, fontSize: 16,
                boxShadow: "0 8px 32px rgba(13,148,136,0.35)",
                transition: "transform 0.2s", display: "inline-block",
              }}>See How It Works →</a>
              <a href="#calc" style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "white", padding: "16px 28px", borderRadius: 14,
                textDecoration: "none", fontWeight: 600, fontSize: 15,
              }}>Calculate Your Savings ↓</a>
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
              <span>✦ Less manual work</span>
              <span>✦ Automated reminders</span>
              <span>✦ Built for small businesses</span>
            </div>
          </div>
          <div style={{ flex: "1 1 520px", maxWidth: 600 }}>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ─── FEATURE STRIP ─── */}
      <section className="af-feature-strip">
        {[
          { icon:"▣", title:"Online bookings", text:"Keep appointments organized" },
          { icon:"✓", title:"Automated reminders", text:"Confirmations and follow-ups" },
          { icon:"♙", title:"Customer management", text:"Keep customer details together" },
          { icon:"▥", title:"Business insights", text:"See what is working" },
          { icon:"⚡", title:"Save time", text:"Less admin, more focus" },
        ].map((item,i)=><div className="af-feature-card" key={item.title}><span className={"af-feature-icon af-feature-icon-"+i}>{item.icon}</span><div><strong>{item.title}</strong><small>{item.text}</small></div></div>)}
      </section>

      {/* ─── SAVINGS CALCULATOR ─── */}
      <section id="calc" style={{
        background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
        padding: "72px 32px 80px",
      }}>
        <FadeIn>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center", justifyContent: "center" }}>
            <div style={{ flex: "1 1 340px", maxWidth: 440 }}>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: "white", lineHeight: 1.15, letterSpacing: -1, marginBottom: 16 }}>
                See exactly how much you're leaving on the table
              </h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                The average appointment business loses 15–30% of revenue to no-shows. Drag the sliders to see your numbers and understand where automation can help.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "📉", text: "Every no-show = an empty slot you can't fill" },
                  { icon: "⏰", text: "Staff calling to confirm = hours wasted weekly" },
                  { icon: "✅", text: "Automated reminders cut no-shows by 30% on average" },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 20 }}>{p.icon}</span>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <SavingsCalculator />
          </div>
        </FadeIn>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ background: "#0b1a2c", padding: "48px 32px" }}>
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
              <div style={{ fontSize: 42, fontWeight: 900, color: "#f5f9ff", letterSpacing: -1 }}>
                {s.n === 0 ? "0" : <Counter target={s.n} />}{s.s}
              </div>
              <div style={{ fontSize: 13, color: "#7187a0", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" style={{ padding: "80px 32px", background: "#081525" }}>
        <FadeIn>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: "#f5f9ff", letterSpacing: -1 }}>How it works</h2>
              <p style={{ color: "#7187a0", fontSize: 15, marginTop: 8 }}>
                From booking to confirmation — fully automated
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
              {[
                { icon: "📅", title: "Customer books", desc: "Via your form, phone, Instagram, or walk-in. We connect to however you take bookings.", color: "#1687ff" },
                { icon: "⚡", title: "Flow triggers", desc: "Our automation engine picks it up instantly — no delay, no manual entry needed.", color: "#F59E0B" },
                { icon: "💬", title: "Reminders go out", desc: "WhatsApp or SMS, 24h and 2h before. Customer confirms or reschedules right in the chat.", color: "#8B5CF6" },
                { icon: "📊", title: "Everything logged", desc: "Dashboard shows confirmed, pending, no-shows. You see the full picture at a glance.", color: "#EF4444" },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: "1 1 200px", maxWidth: 210, textAlign: "center", padding: "28px 16px",
                  background: "#0b1a2c", borderRadius: 18, border: "1px solid #1d3b59",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                    width: 40, height: 3, borderRadius: 2, background: s.color,
                  }} />
                  <div style={{
                    width: 52, height: 52, borderRadius: 16, margin: "8px auto 14px",
                    background: `${s.color}12`, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 24,
                  }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#f5f9ff", marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 12.5, color: "#91a7bd", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── USE CASES ─── */}
      <section id="industries" style={{ padding: "72px 32px", background: "#0b1a2c" }}>
        <FadeIn>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: "#f5f9ff", textAlign: "center", marginBottom: 12, letterSpacing: -0.5 }}>
              Built for businesses like yours
            </h2>
            <p style={{ color: "#7187a0", textAlign: "center", fontSize: 15, marginBottom: 40 }}>
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
                  background: "#081525", borderRadius: 18, padding: "24px 20px",
                  flex: "1 1 170px", maxWidth: 190, border: "1px solid #1d3b59",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#f5f9ff", marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#1687ff", marginBottom: 6 }}>{c.stat}</div>
                  <div style={{ fontSize: 12, color: "#91a7bd", lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ padding: "80px 32px", background: "#081525" }}>
        <FadeIn>
          <div style={{ maxWidth: 1060, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <h2 style={{ fontSize: 34, fontWeight: 900, color: "#f5f9ff", letterSpacing: -1 }}>Simple, honest pricing</h2>
              <p style={{ color: "#7187a0", fontSize: 15, marginTop: 8 }}>Start free. Upgrade when the ROI is obvious.</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", alignItems: "stretch" }}>
              <PricingCard tier="Starter" price="Free" desc="Try it with basic reminders"
                ctaLabel="Start Free" onCta={() => { window.location.href = DASHBOARD_URL; }}
                features={["1 active automation", "Up to 50 reminders/month", "WhatsApp or SMS", "Basic dashboard"]} />
              <PricingCard tier="Professional" price="AED 149" desc="For businesses that can't afford no-shows" highlight badge="Most Popular"
                ctaLabel="Get Started" onCta={() => { window.location.href = DASHBOARD_URL; }}
                features={["5 active automations", "Unlimited reminders", "WhatsApp + SMS", "No-show tracking dashboard", "Follow-up sequences", "Priority support"]} />
              <PricingCard tier="Business" price="AED 349" desc="Full automation suite, custom workflows"
                ctaLabel="Get Started" onCta={() => { window.location.href = DASHBOARD_URL; }}
                features={["Unlimited automations", "Custom workflow builds", "Multi-location support", "Lead capture + CRM sync", "Dedicated account manager", "Monthly performance report"]} />
            </div>
            <p style={{ textAlign: "center", color: "#7187a0", fontSize: 13, marginTop: 28 }}>
              Already a customer? <a href={DASHBOARD_URL} style={{ color: "#1687ff", fontWeight: 700, textDecoration: "none" }}>Log in to your dashboard →</a>
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
              <div style={{ fontWeight: 800, fontSize: 18, color: "white", marginBottom: 6 }}>
                Built security-first, from the ground up
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                Every account is fully isolated — one business can never see another's data,
                credentials, or automations. Access is enforced at the server, not just hidden
                in the interface. We run continuous security monitoring and intrusion detection
                across our own infrastructure, so your customers' details stay yours alone.
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: "#0F172A", padding: "48px 32px", textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #1687ff, #00c8ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 900, fontSize: 15,
          }}>A</div>
          <AutoFlowLogo />
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
          <a href="#pricing" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>Pricing</a>
          <a href={DASHBOARD_URL} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>Log in</a>
        </div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 6 }}>
          Automation services for businesses in the UAE
        </div>
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>© 2026 AutoFlow. All rights reserved.</div>
      </footer>
    </div>
  );
}
