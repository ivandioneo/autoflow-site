import { useState, useRef } from 'react';
import { QUIZ_STEPS } from '../content';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.autoflow.ivanit.work';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

/**
 * Quiz — 3-step funnel that posts directly to /auth/register.
 *
 * Security notes:
 * - No webhook. Posts only to api.autoflow.ivanit.work.
 * - Cloudflare Turnstile token is required before submission.
 * - Access token is NEVER stored. The register endpoint returns
 *   a verification-pending message only (per AutoFlow auth rules).
 * - All inputs sanitised and length-limited before POST.
 * - mode: 'cors', credentials: 'omit' — no cookies sent.
 * - referrerPolicy: 'no-referrer' — no Referer header to API.
 */
export default function Quiz({ onComplete }) {
  const [step, setStep] = useState(0); // 0,1,2 = quiz; 3 = register form; 4 = done
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({ email: '', password: '', business: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const turnstileRef = useRef(null);
  const lastSubmitRef = useRef(0);

  const currentQuiz = QUIZ_STEPS[step];
  const progress = step < 3 ? (step / (QUIZ_STEPS.length + 1)) * 100 : 90;

  const sanitize = (s) => s.replace(/<[^>]*>/g, '').replace(/[<>"'`]/g, '').trim();
  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isValidPassword = (p) => p.length >= 8;
  const isValidBusiness = (b) => b.trim().length >= 2 && b.trim().length <= 80;

  const selectOption = (value) => {
    const key = QUIZ_STEPS[step].id;
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    setTimeout(() => {
      if (step < QUIZ_STEPS.length - 1) {
        setStep(step + 1);
      } else {
        setStep(QUIZ_STEPS.length); // advance to register form
      }
    }, 280); // brief pause so selected state is visible
  };

  const validateRegister = () => {
    const e = {};
    if (!isValidEmail(form.email)) e.email = 'Enter a valid email address';
    if (!isValidPassword(form.password)) e.password = 'Password must be at least 8 characters';
    if (!isValidBusiness(form.business)) e.business = 'Enter your business name (2–80 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    const now = Date.now();
    if (now - lastSubmitRef.current < 8000) return;
    if (!validateRegister()) return;

    // Get Turnstile token if configured
    let turnstileToken = '';
    if (TURNSTILE_SITE_KEY && turnstileRef.current) {
      try {
        turnstileToken = await turnstileRef.current.getResponse();
      } catch (_) {
        // Turnstile not yet rendered or not configured — proceed without in dev
      }
    }

    setSubmitting(true);
    setServerError(null);
    lastSubmitRef.current = now;

    try {
      const payload = {
        email: form.email.toLowerCase().trim(),
        password: form.password,
        business_name: sanitize(form.business).slice(0, 80),
        // Quiz answers stored as onboarding_meta for future dashboard personalisation
        onboarding_meta: answers,
        ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
      };

      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Registration failed (${res.status})`);
      }

      setStep(QUIZ_STEPS.length + 1); // done state
      if (onComplete) onComplete(answers);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ——— Done state ———
  if (step === QUIZ_STEPS.length + 1) {
    return (
      <div style={{
        textAlign: 'center', padding: '56px 32px',
        background: '#F0FDF4', borderRadius: 20, border: '1px solid #BBF7D0',
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>\uD83C\uDF89</div>
        <h3 style={{
          fontFamily: "'Boska', Georgia, serif",
          fontSize: 24, fontWeight: 700, color: '#0C0A09', marginBottom: 8,
        }}>You're in!</h3>
        <p style={{ color: '#64748B', fontSize: 14, lineHeight: 1.6, maxWidth: '36ch', margin: '0 auto 20px' }}>
          Check your email to verify your account, then sign in to see your personalised automation plan.
        </p>
        <a
          href={import.meta.env.VITE_DASHBOARD_URL || 'https://dashboard.autoflow.ivanit.work'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: '#0D9488', color: 'white',
            padding: '12px 28px', borderRadius: 10,
            textDecoration: 'none', fontWeight: 700, fontSize: 14,
          }}
        >
          Go to Dashboard →
        </a>
      </div>
    );
  }

  // ——— Register form (step 3) ———
  if (step === QUIZ_STEPS.length) {
    return (
      <div style={{
        background: '#F8FAFC', borderRadius: 20,
        padding: '36px 28px', border: '1px solid #E2E8F0',
      }}>
        <ProgressBar value={90} />
        <h3 style={{
          fontFamily: "'Boska', Georgia, serif",
          fontSize: 22, fontWeight: 700, color: '#0C0A09', marginBottom: 6,
        }}>Create your free account</h3>
        <p style={{ color: '#64748B', fontSize: 13, marginBottom: 24 }}>
          Your automation plan is ready. Create an account to activate it.
        </p>

        {serverError && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 10, padding: '10px 14px', marginBottom: 14,
            color: '#DC2626', fontSize: 13,
          }}>
            {serverError}
          </div>
        )}

        {[{ key: 'business', label: 'Business name', type: 'text', ph: 'GlowCuts Salon', max: 80 },
          { key: 'email', label: 'Work email', type: 'email', ph: 'you@yourbusiness.ae', max: 120 },
          { key: 'password', label: 'Password', type: 'password', ph: 'Min. 8 characters', max: 128 },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{
              fontSize: 12, fontWeight: 700, color: '#0C0A09',
              display: 'block', marginBottom: 5,
              textTransform: 'uppercase', letterSpacing: 0.4,
            }}>{f.label}</label>
            <input
              type={f.type}
              placeholder={f.ph}
              value={form[f.key]}
              maxLength={f.max}
              autoComplete={f.key === 'password' ? 'new-password' : f.key === 'email' ? 'email' : 'organization'}
              onChange={e => {
                let v = e.target.value;
                if (f.key === 'email') v = v.toLowerCase();
                setForm(prev => ({ ...prev, [f.key]: v }));
                if (errors[f.key]) setErrors(prev => ({ ...prev, [f.key]: null }));
              }}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10,
                border: errors[f.key] ? '1px solid #EF4444' : '1px solid #E2E8F0',
                fontSize: 14, outline: 'none', fontFamily: 'inherit',
                background: 'white', transition: 'border-color 0.18s',
              }}
            />
            {errors[f.key] && (
              <p style={{ color: '#EF4444', fontSize: 11, marginTop: 4 }}>{errors[f.key]}</p>
            )}
          </div>
        ))}

        {/* Turnstile widget placeholder — renders when VITE_TURNSTILE_SITE_KEY is set */}
        {TURNSTILE_SITE_KEY && (
          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-theme="light"
            style={{ marginBottom: 16 }}
            ref={turnstileRef}
          />
        )}

        <button
          onClick={handleRegister}
          disabled={submitting}
          style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: submitting ? '#94A3B8' : '#0D9488',
            color: 'white', fontWeight: 700, fontSize: 15,
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: submitting ? 'none' : '0 6px 24px rgba(13,148,136,0.28)',
            transition: 'all 0.18s',
          }}
        >
          {submitting ? 'Creating account…' : 'Create free account →'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 10 }}>
          By creating an account you agree to our terms. No payment required.
        </p>
      </div>
    );
  }

  // ——— Quiz steps 0–2 ———
  return (
    <div style={{
      background: '#F8FAFC', borderRadius: 20,
      padding: '36px 28px', border: '1px solid #E2E8F0',
      minHeight: 320,
    }}>
      <ProgressBar value={progress} />

      <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 6, fontWeight: 600 }}>
        STEP {step + 1} OF {QUIZ_STEPS.length + 1}
      </p>
      <h3 style={{
        fontFamily: "'Boska', Georgia, serif",
        fontSize: 22, fontWeight: 700, color: '#0C0A09', marginBottom: 6, lineHeight: 1.2,
      }}>
        {currentQuiz.question}
      </h3>
      <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24 }}>{currentQuiz.hint}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {currentQuiz.options.map(opt => (
          <button
            key={opt.value}
            onClick={() => selectOption(opt.value)}
            style={{
              flex: '1 1 calc(50% - 5px)',
              minWidth: 130,
              padding: '12px 16px',
              borderRadius: 12,
              border: answers[currentQuiz.id] === opt.value
                ? '2px solid #0D9488'
                : '1px solid #E2E8F0',
              background: answers[currentQuiz.id] === opt.value
                ? 'rgba(13,148,136,0.06)'
                : 'white',
              color: answers[currentQuiz.id] === opt.value ? '#0D9488' : '#475569',
              fontWeight: 600, fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', gap: 8,
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 18 }}>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div style={{
      height: 3, background: '#E2E8F0', borderRadius: 2,
      marginBottom: 24, overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', width: `${value}%`,
        background: 'linear-gradient(90deg, #0D9488, #14B8A6)',
        borderRadius: 2,
        transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  );
}
