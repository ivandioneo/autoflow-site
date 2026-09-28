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
  const [bookingsPerWeek, setBookingsPerWeek] = useState(76);
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
  return <div className="af-hero-visual">
    <div className="af-dashboard-glow" />
    <div className="af-laptop">
      <div className="af-laptop-screen">
        <div className="af-laptop-camera" />
        <div className="af-dashboard">
          <div className="af-dashboard-top"><div className="af-window-dots"><i/><i/><i/></div><div className="af-dashboard-brand"><AutoFlowLogo compact /></div><div className="af-live">● Live</div></div>
          <div className="af-dashboard-body"><aside className="af-dashboard-sidebar"><div className="af-side-item active">⌂ <span>Dashboard</span></div>
            {tabs.map(t=><button key={t.key} className={active===t.key?"af-side-item active":"af-side-item"} onClick={()=>setActive(t.key)} type="button">{t.key==="bookings"?"▣":t.key==="customers"?"♙":"⚡"} <span>{t.label}</span></button>)}<div className="af-side-item">⚙ <span>Settings</span></div>
          </aside><div className="af-dashboard-main"><div className="af-dashboard-heading"><div><small>Monday, June 16</small><h3>{active==="bookings"?"Bookings":active==="customers"?"Customers":"Automation flows"}</h3></div><button className="af-mini-cta" type="button">+ New</button></div>
            {active==="bookings"&&<div className="af-calendar">{["Mon 10","Tue 11","Wed 12","Thu 13"].map((d,i)=><div className="af-day" key={d}><strong>{d}</strong><div className="af-event blue" style={{marginTop:28}}>Haircut<br/><small>10:00</small></div>{i===1&&<div className="af-event purple">Hair Color<br/><small>11:30</small></div>}{i===2&&<div className="af-event green">Treatment<br/><small>14:00</small></div>}</div>)}</div>}
            {active==="customers"&&<div className="af-data-list">{["Sarah Lim","Jane Doe","Mike Tan","Anna Lee"].map((n,i)=><div className="af-data-row" key={n}><span className="af-avatar">{n[0]}</span><span>{n}<small>{i%2?"Returning customer":"New customer"}</small></span><b>{i+2} visits</b></div>)}</div>}
            {active==="automations"&&<div className="af-flow-preview"><div className="af-flow-node">📅 Customer books</div><span>↓</span><div className="af-flow-node blue-node">✓ Confirmation sent</div><span>↓</span><div className="af-flow-node green-node">⏰ Reminder scheduled</div><span>↓</span><div className="af-flow-node purple-node">↻ Follow-up triggered</div></div>}
          </div></div>
        </div>
      </div>
      <div className="af-laptop-hinge" />
      <div className="af-laptop-base"><div className="af-laptop-trackpad" /></div>
    </div>
    <AutomationFlowMockup />
  </div>;
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
        .af-automation-visual { position:absolute; right:-24px; bottom:-18px; width:430px; z-index:5; animation:float 5s ease-in-out infinite; }
        .af-automation-glow { position:absolute; inset:10% 0 0; background:radial-gradient(circle,rgba(0,200,255,.22),transparent 68%); filter:blur(30px); }
        .af-flow-card { position:relative; background:rgba(7,20,37,.94); border:1px solid rgba(0,200,255,.18); border-radius:22px; padding:20px; box-shadow:0 26px 70px rgba(0,0,0,.42),0 0 35px rgba(0,140,255,.12); backdrop-filter:blur(16px); }
        .af-flow-card-head { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:18px; }.af-flow-card-head small,.af-flow-step small,.af-flow-result small { display:block; color:#7187a0; font-size:10px; margin-top:3px; }.af-flow-card-head strong { display:block; color:#fff; font-size:14px; }
        .af-flow-status { color:#43e6a0; font-size:10px; font-weight:800; padding:6px 9px; border-radius:99px; background:rgba(67,230,160,.08); border:1px solid rgba(67,230,160,.16); }.af-flow-status i { display:inline-block; width:6px; height:6px; border-radius:50%; background:#43e6a0; margin-right:5px; box-shadow:0 0 8px #43e6a0; }
        .af-flow-step { display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:13px; background:rgba(255,255,255,.035); border:1px solid rgba(255,255,255,.07); }.af-flow-step strong { display:block; color:#eaf4ff; font-size:12px; }.af-flow-icon { width:31px; height:31px; display:grid; place-items:center; border-radius:9px; font-size:14px; background:rgba(22,135,255,.13); }.af-flow-cyan .af-flow-icon{background:rgba(0,200,255,.12)}.af-flow-green .af-flow-icon{background:rgba(67,230,160,.12)}.af-flow-purple .af-flow-icon{background:rgba(139,92,246,.13)}
        .af-flow-connector { height:17px; position:relative; }.af-flow-connector:before { content:""; position:absolute; left:27px; top:0; bottom:0; border-left:1px dashed rgba(0,200,255,.28); }.af-flow-connector span { position:absolute; width:6px; height:6px; border-radius:50%; background:#00c8ff; left:24px; top:5px; box-shadow:0 0 10px #00c8ff; animation:flowPulse 1.8s ease-in-out infinite; }
        .af-flow-result { display:flex; align-items:center; gap:10px; margin-top:16px; padding:10px 12px; border-radius:12px; background:linear-gradient(90deg,rgba(22,135,255,.1),rgba(67,230,160,.07)); border:1px solid rgba(0,200,255,.1); }.af-flow-result > span{font-size:17px}.af-flow-result strong{display:block;color:#fff;font-size:11px}.af-flow-result b{margin-left:auto;color:#43e6a0;font-size:9px;letter-spacing:1px}
        @keyframes flowPulse { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(8px);opacity:1} }
        .af-feature-strip { display:flex; gap:12px; padding:14px max(24px,calc((100vw - 1240px)/2)); background:rgba(7,24,43,.92); border-top:1px solid rgba(255,255,255,.04); border-bottom:1px solid rgba(255,255,255,.05); overflow-x:auto; }.af-feature-card{min-width:205px;flex:1;display:flex;align-items:center;gap:11px;padding:13px 14px;border-radius:13px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.045)}.af-feature-icon{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;color:#fff;font-weight:800;background:rgba(22,135,255,.15)}.af-feature-icon-1{background:rgba(0,200,255,.12);color:#00c8ff}.af-feature-icon-2{background:rgba(139,92,246,.13);color:#b69cff}.af-feature-icon-3{background:rgba(67,230,160,.12);color:#43e6a0}.af-feature-icon-4{background:rgba(245,158,11,.12);color:#f5b84a}.af-feature-card strong{display:block;color:#eaf4ff;font-size:11px}.af-feature-card small{display:block;color:#7187a0;font-size:9px;margin-top:3px}
        .af-hero-photo { position:absolute; inset:0; background-image:url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=80"); background-size:cover; background-position:center right; opacity:.32; filter:saturate(1.05) contrast(1.03); transform:scale(1.03); }
        .af-hero-photo-overlay { position:absolute; inset:0; background:linear-gradient(90deg,rgba(3,14,28,.98) 0%,rgba(4,19,38,.88) 40%,rgba(4,18,35,.62) 72%,rgba(2,12,25,.78) 100%),linear-gradient(180deg,rgba(4,16,31,.35),#061426 92%); z-index:1; }
        .af-hero-grid { position:absolute; inset:0; z-index:1; opacity:.5; background-image:linear-gradient(rgba(0,200,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,.045) 1px,transparent 1px); background-size:80px 80px; mask-image:linear-gradient(to bottom,rgba(0,0,0,.7),transparent 85%); }
        .af-hero-section:after { content:""; position:absolute; width:700px; height:700px; right:-260px; top:-240px; border-radius:50%; background:radial-gradient(circle,rgba(0,200,255,.18),transparent 65%); filter:blur(20px); z-index:1; pointer-events:none; }
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
        .af-hero-visual { position:relative; min-height:650px; display:flex; align-items:center; justify-content:center; padding:25px 0 90px; }
        .af-dashboard-glow { position:absolute; width:560px; height:430px; border-radius:50%; background:radial-gradient(circle,rgba(22,135,255,.25),transparent 68%); filter:blur(32px); }
        .af-laptop { position:relative; z-index:2; width:min(735px,100%); padding:0 10px 68px; filter:drop-shadow(0 30px 45px rgba(0,0,0,.32)); }
        .af-laptop-screen { position:relative; padding:10px 10px 0; border-radius:18px 18px 8px 8px; background:linear-gradient(145deg,#1a2738,#07111d 70%); border:1px solid rgba(255,255,255,.18); box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 55px rgba(0,140,255,.12); }
        .af-laptop-screen:before { content:""; position:absolute; inset:0; border-radius:18px 18px 8px 8px; box-shadow:inset 0 1px 0 rgba(255,255,255,.1); pointer-events:none; }
        .af-laptop-camera { position:absolute; z-index:4; top:3px; left:50%; width:7px; height:3px; transform:translateX(-50%); border-radius:0 0 4px 4px; background:#02070d; }
        .af-dashboard { position:relative; z-index:2; width:100%; border:1px solid rgba(255,255,255,.13); border-radius:10px 10px 4px 4px; overflow:hidden; background:#081525; box-shadow:inset 0 0 35px rgba(0,0,0,.2); }
        .af-laptop-hinge { position:absolute; z-index:3; left:50%; bottom:62px; width:90px; height:8px; transform:translateX(-50%); border-radius:0 0 8px 8px; background:#111c29; border:1px solid rgba(255,255,255,.1); }
        .af-laptop-base { position:absolute; z-index:1; left:-2%; right:-2%; bottom:20px; height:48px; border-radius:5px 5px 18px 18px; background:linear-gradient(180deg,#26384c 0%,#152337 38%,#091522 100%); border:1px solid rgba(255,255,255,.14); box-shadow:0 12px 28px rgba(0,0,0,.5); clip-path:polygon(3% 0,97% 0,100% 72%,94% 100%,6% 100%,0 72%); }
        .af-laptop-trackpad { position:absolute; left:41%; top:8px; width:18%; height:25px; border-radius:4px 4px 9px 9px; background:rgba(8,18,30,.6); border:1px solid rgba(255,255,255,.07); }
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
        /* Reference visual system: deep navy + photographic office + cyan glow */
        .af-hero-section { min-height: 620px; }
        .af-hero-photo {
          background-image:url("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2200&q=88");
          background-position:center 48%;
          opacity:.34;
          filter:saturate(1.15) contrast(1.05);
        }
        .af-hero-photo-overlay {
          background:
            linear-gradient(90deg,rgba(2,13,28,.94) 0%,rgba(3,17,34,.78) 45%,rgba(2,13,28,.42) 100%),
            linear-gradient(180deg,rgba(2,11,24,.48) 0%,rgba(2,13,28,.82) 92%);
        }
        .af-hero-grid { display:none; }
        .af-hero-section:before {
          content:""; position:absolute; width:760px; height:760px; right:-120px; top:-330px;
          border-radius:50%; border:1px solid rgba(0,200,255,.28);
          box-shadow:0 0 0 1px rgba(22,135,255,.05),0 0 90px rgba(0,200,255,.08);
          transform:rotate(-18deg); z-index:1; pointer-events:none;
        }
        .af-hero-section:after {
          width:1100px; height:1100px; right:-520px; top:40px;
          border:1px solid rgba(0,200,255,.18); background:none; filter:none;
        }
        .af-hero-visual { min-height:650px; padding-top:38px; }
        .af-laptop { width:min(760px,100%); transform:translateY(14px); }
        .af-laptop-screen {
          border-radius:20px 20px 7px 7px;
          background:linear-gradient(145deg,#223347,#07111d 65%);
          box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 75px rgba(0,157,255,.16);
        }
        .af-dashboard { border-radius:11px 11px 4px 4px; }
        .af-dashboard-body { min-height:340px; }
        .af-dashboard-sidebar { width:132px; }
        .af-calendar { grid-template-columns:repeat(5,1fr); }
        .af-day { min-height:250px; }
        .af-automation-visual {
          right:-38px; bottom:-2px; width:440px;
          animation:float 6s ease-in-out infinite;
        }
        .af-flow-card {
          background:rgba(3,17,32,.95);
          border-color:rgba(0,200,255,.34);
          box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 40px rgba(0,180,255,.16);
        }
        .af-feature-strip {
          position:relative; z-index:8;
          background:rgba(2,16,33,.94);
          padding-top:15px; padding-bottom:15px;
          border-top:1px solid rgba(0,200,255,.12);
        }
        .af-feature-card {
          min-width:0;
          background:rgba(8,29,49,.72);
          border-color:rgba(73,215,255,.08);
        }
        .af-reference-section {
          position:relative; overflow:hidden; color:#fff;
          background:#041a31;
          border-top:1px solid rgba(0,200,255,.07);
        }
        .af-reference-section:before {
          content:""; position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(circle at 50% 0%,rgba(0,164,255,.08),transparent 55%);
        }
        .af-reference-inner { position:relative; z-index:1; max-width:1240px; margin:0 auto; padding:34px 20px 28px; }
        .af-reference-heading { text-align:center; margin-bottom:20px; }
        .af-reference-heading h2 { color:#f7fbff; font-size:28px; line-height:1.1; font-weight:900; letter-spacing:-.8px; }
        .af-reference-heading p { color:#9db1c6; font-size:13px; margin-top:7px; }
        .af-industry-grid { display:grid; grid-template-columns:repeat(8,1fr); gap:8px; }
        .af-industry-card {
          height:116px; border-radius:10px; overflow:hidden; background-size:cover; background-position:center;
          border:1px solid rgba(255,255,255,.12); box-shadow:0 12px 30px rgba(0,0,0,.22);
          display:flex; align-items:flex-end; padding:10px; transition:transform .25s ease,border-color .25s ease;
        }
        .af-industry-card:hover { transform:translateY(-4px); border-color:rgba(0,200,255,.5); }
        .af-industry-card span { color:#fff; font-size:10px; font-weight:800; text-shadow:0 2px 10px rgba(0,0,0,.7); }
        .af-how-section { background:#041b33; padding-bottom:34px; }
        .af-how-grid { display:grid; grid-template-columns:1fr 40px 1fr 40px 1fr; align-items:center; }
        .af-how-card {
          min-height:142px; padding:16px 20px; border:1px solid rgba(74,149,205,.18); border-radius:16px;
          background:linear-gradient(145deg,rgba(7,30,53,.9),rgba(4,21,39,.72));
          box-shadow:inset 0 1px 0 rgba(255,255,255,.03);
        }
        .af-how-top { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .af-step-number { width:40px; height:40px; border-radius:50%; display:grid; place-items:center; color:#fff; font-weight:900; font-size:17px; box-shadow:0 8px 20px rgba(0,0,0,.22); }
        .af-step-icon { width:40px; height:40px; display:grid; place-items:center; border-radius:10px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.09); color:#e8f5ff; font-size:19px; }
        .af-how-card strong { display:block; color:#fff; font-size:13px; margin-bottom:5px; }
        .af-how-card p { color:#8fa5ba; font-size:11px; line-height:1.5; max-width:250px; }
        .af-how-arrow { color:#cfe9ff; font-size:30px; text-align:center; }
        #calc {
          position:relative; overflow:hidden;
          background:
            linear-gradient(90deg,rgba(2,14,29,.91),rgba(3,19,38,.88)),
            url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=88") center/cover;
          padding-top:58px !important; padding-bottom:66px !important;
        }
        #calc:after {
          content:""; position:absolute; inset:auto -15% -40% -15%; height:260px;
          border-radius:50% 50% 0 0; border-top:1px solid rgba(0,200,255,.22);
          box-shadow:0 -20px 90px rgba(0,160,255,.08); pointer-events:none;
        }
        #calc > div { position:relative; z-index:1; }
        #calc h2 { font-size:34px !important; }
        #calc input[type="range"] { height:5px; }
        #calc input[type="range"]::-webkit-slider-runnable-track { height:5px; background:linear-gradient(90deg,#f5a400,#ffb51b); border-radius:99px; }
        #calc input[type="range"]::-webkit-slider-thumb { margin-top:-5px; width:15px; height:15px; }
        @media (max-width: 980px) {
          .af-industry-grid { grid-template-columns:repeat(4,1fr); }
          .af-how-grid { grid-template-columns:1fr; gap:12px; }
          .af-how-arrow { transform:rotate(90deg); }
        }

        @media (max-width: 620px) {
          .af-reference-inner { padding-left:16px; padding-right:16px; }
          .af-reference-heading h2 { font-size:24px; }
          .af-industry-grid { grid-template-columns:repeat(2,1fr); gap:8px; }
          .af-industry-card { height:105px; }
          .af-how-card { min-height:128px; padding:14px; }
          .af-how-arrow { display:none; }
          .af-reference-section { padding-bottom:8px; }
          #calc { padding-left:16px !important; padding-right:16px !important; }
        }
        .af-faq-section { background:#031a30; }
        .af-faq-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .af-faq-grid details { background:rgba(7,30,53,.78); border:1px solid rgba(74,149,205,.18); border-radius:14px; padding:16px; }
        .af-faq-grid summary { color:#fff; font-weight:800; font-size:13px; cursor:pointer; }
        .af-faq-grid p { color:#8fa5ba; font-size:11px; line-height:1.55; margin-top:10px; }
        @media (max-width:980px){ .af-faq-grid{grid-template-columns:1fr;} }
        @media (max-width: 900px) {
          .af-hero-photo { background-position:68% center; opacity:.22; } .af-hero-photo-overlay { background:linear-gradient(180deg,rgba(3,14,28,.93) 0%,rgba(4,18,35,.84) 55%,rgba(3,14,28,.97) 100%); }
          .af-nav { padding:12px 18px; }.af-logo-mark { width:46px; height:39px; }.af-logo-type { font-size:22px; }.af-nav-links { position:absolute; top:66px; left:12px; right:12px; display:none; flex-direction:column; align-items:stretch; gap:4px; padding:12px; background:rgba(7,19,33,.98); border:1px solid rgba(255,255,255,.1); border-radius:14px; box-shadow:0 20px 50px rgba(0,0,0,.45); }.af-nav-links.open { display:flex; }.af-nav-links a { padding:12px 13px; border-radius:9px; }.af-nav-links .af-nav-cta { text-align:center; }.af-menu-btn { display:block; }
          .af-hero-visual { min-height:0; margin-top:18px; padding:0 0 8px; display:block; }.af-laptop { width:100%; padding:0 0 42px; }.af-laptop-screen { padding:7px 7px 0; border-radius:13px 13px 6px 6px; }.af-dashboard { width:100%; }.af-laptop-base { left:-3%; right:-3%; bottom:9px; height:34px; border-radius:4px 4px 13px 13px; }.af-laptop-trackpad { top:6px; height:18px; }.af-laptop-hinge { bottom:43px; width:60px; height:6px; }.af-phone-mini { display:none; }
          .af-automation-visual { position:relative; right:auto; bottom:auto; width:82%; margin:-4px 0 0 auto; animation:none; transform:translateX(2%); }
          .af-flow-card { padding:14px; border-radius:18px; }
        }
        @media (max-width: 620px) {
          .af-hero-section { padding-left:16px !important; padding-right:16px !important; } .af-hero-photo { background-position:76% center; opacity:.18; }
          .af-hero-visual { min-height:0; margin-left:-2px; margin-right:-2px; }.af-dashboard-sidebar { display:none; }.af-dashboard-body { min-height:230px; }.af-calendar { gap:4px; }.af-day { min-height:165px; padding:5px; }.af-event { font-size:8px; padding:6px 4px; }
          .af-laptop { padding-bottom:34px; }.af-laptop-screen { padding:5px 5px 0; border-radius:10px 10px 5px 5px; }.af-laptop-base { bottom:5px; height:27px; }.af-laptop-trackpad { top:5px; height:13px; }.af-laptop-hinge { bottom:32px; width:48px; height:5px; }
          .af-automation-visual { width:84%; margin:-6px 0 0 auto; transform:translateX(1%); }
          .af-flow-card { padding:12px; border-radius:16px; } .af-flow-step { padding:8px 9px; gap:9px; } .af-flow-step strong { font-size:10px; } .af-flow-step small { font-size:8px; } .af-flow-icon { width:26px; height:26px; font-size:12px; } .af-flow-result { margin-top:10px; padding:8px 10px; }
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
          <a href="#faq" onClick={() => setMobileNavOpen(false)}>FAQ</a>
          <a href={DASHBOARD_URL} className="af-login">Log in</a>
          <a href={DASHBOARD_URL} className="af-nav-cta" onClick={() => setMobileNavOpen(false)}>Open AutoFlow →</a>
        </div>
        <button className="af-menu-btn" type="button" aria-label={mobileNavOpen ? "Close menu" : "Open menu"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(v => !v)}><span /><span /><span /></button>
      </nav>
      {/* ─── HERO ─── */}
      <section className="af-hero-section" style={{
        background: "#061426",
        padding: "112px 32px 74px", position: "relative", overflow: "hidden",
      }}>
        <div className="af-hero-photo" aria-hidden="true" />
        <div className="af-hero-photo-overlay" aria-hidden="true" />
        <div className="af-hero-grid" aria-hidden="true" />
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
          maxWidth: 1240, margin: "0 auto", display: "flex", flexWrap: "wrap", zIndex: 2,
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
          <div style={{ flex: "1 1 560px", maxWidth: 735, transform: "translateY(18px)" }}>
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

      {/* ─── INDUSTRIES ─── */}
      <section id="industries" className="af-reference-section af-industries-section">
        <FadeIn>
          <div className="af-reference-inner">
            <div className="af-reference-heading">
              <h2>Built for Real Businesses</h2>
              <p>AutoFlow works for many industries. Get a ready-to-use solution tailored to your business.</p>
            </div>
            <div className="af-industry-grid">
              {[
                ["Hair Salon","https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=85","✂"],
                ["Beauty & Spa","https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=700&q=85","♨"],
                ["Clinic","https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=700&q=85","⚕"],
                ["Barber Shop","https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=85","✂"],
                ["Cleaning Services","https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=85","♧"],
                ["Fitness & Wellness","https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=85","✚"],
                ["Coaching & Consulting","https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=85","◉"],
                ["Food & Beverage","https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=85","◌"],
              ].map(([title,image,icon]) => (
                <div className="af-industry-card" key={title} style={{backgroundImage:"linear-gradient(180deg,transparent 28%,rgba(2,10,22,.95) 100%),url("+image+")"}}>
                  <span>{icon} {title}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── HOW AUTOFLOW WORKS ─── */}
      <section id="how" className="af-reference-section af-how-section">
        <FadeIn>
          <div className="af-reference-inner">
            <div className="af-reference-heading">
              <h2>How AutoFlow Works</h2>
              <p>Get your business online and automated in just 3 simple steps.</p>
            </div>
            <div className="af-how-grid">
              {[
                ["1","▣","Create Your Profile","Tell us about your business and choose a template.","#1687ff"],
                ["2","▤","AutoFlow Generates Your Page","We create your branded website with booking system.","#7c3aed"],
                ["3","♟","Customers Book Automatically","Start getting bookings and let automation do the rest.","#10d89a"],
              ].map(([n,icon,title,desc,color],i)=>(
                <div className="af-how-wrap" key={title}>
                  <div className="af-how-card">
                    <div className="af-how-top">
                      <span className="af-step-number" style={{background:color}}>{n}</span>
                      <span className="af-step-icon">{icon}</span>
                    </div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                  {i<2 && <span className="af-how-arrow" aria-hidden="true">→</span>}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
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

      {/* ─── FAQ ─── */}
      <section id="faq" className="af-reference-section af-faq-section">
        <div className="af-reference-inner">
          <div className="af-reference-heading"><h2>Frequently Asked Questions</h2><p>Simple answers before you get started.</p></div>
          <div className="af-faq-grid">
            <details><summary>Do I need coding skills?</summary><p>No. AutoFlow is designed so the setup and automation flow can be configured without coding.</p></details>
            <details><summary>What happens after a customer books?</summary><p>AutoFlow can trigger confirmations, reminders and follow-ups automatically through the configured workflow.</p></details>
            <details><summary>Can I start for free?</summary><p>Yes. The Starter plan on this page is presented as a free starting option.</p></details>
          </div>
        </div>
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
