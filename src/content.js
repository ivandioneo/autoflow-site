/**
 * AutoFlow — Single source of truth for all marketing copy.
 * Edit here only. Components import from this file.
 * Changing pricing, plans, quiz questions, or copy never requires
 * touching layout or logic files.
 */

export const SITE = {
  name: 'AutoFlow',
  tagline: 'Put your business on autopilot.',
  description:
    'Automated reminders, follow-ups, and booking confirmations — built for UAE businesses.',
};

export const NAV_LINKS = [
  { label: 'Calculator', href: '#calc' },
  { label: 'How it works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
];

export const HERO = {
  badge: 'Automation built for UAE businesses',
  heading: ['Put your business', 'on autopilot.'],
  body:
    'Automated reminders, follow-ups, and booking confirmations that run on their own — so you stop chasing customers and start reclaiming your time. Built for salons, clinics, tutors, and travel agencies in the UAE.',
  trust: ['No setup fees', 'Works with WhatsApp', 'Cancel anytime'],
};

export const CALCULATOR = {
  heading: "See exactly how much you're leaving on the table",
  body:
    'The average appointment business loses 15–30% of revenue to no-shows. Drag the sliders to see your numbers — then let us fix them.',
  sliders: [
    { key: 'bookings', label: 'Bookings per week', min: 5, max: 100, default: 40, unit: '' },
    { key: 'price', label: 'Average booking price', min: 30, max: 500, default: 150, unit: ' AED' },
    { key: 'noshow', label: 'Your no-show rate', min: 5, max: 50, default: 20, unit: '%' },
  ],
  points: [
    { icon: '\uD83D\uDCC9', text: 'Every no-show = an empty slot you can\'t fill' },
    { icon: '\u23F0', text: 'Staff calling to confirm = hours wasted weekly' },
    { icon: '\u2705', text: 'Automated reminders cut no-shows by 30% on average' },
  ],
};

export const STATS = [
  { n: 30, suffix: '%', label: 'Average no-show reduction' },
  { n: 5, suffix: ' min', label: 'Setup time' },
  { n: 24, suffix: '/7', label: 'Runs while you sleep' },
  { n: 0, suffix: '', label: 'Messages you send manually' },
];

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Customer books',
    desc: 'Via your form, phone, Instagram, or walk-in. We connect to however you take bookings.',
    color: '#0D9488',
  },
  {
    step: '02',
    title: 'Flow triggers',
    desc: 'Our automation engine picks it up instantly — no delay, no manual entry needed.',
    color: '#F59E0B',
  },
  {
    step: '03',
    title: 'Reminders go out',
    desc: 'WhatsApp or SMS, 24h and 2h before. Customer confirms or reschedules right in the chat.',
    color: '#8B5CF6',
  },
  {
    step: '04',
    title: 'Everything logged',
    desc: 'Dashboard shows confirmed, pending, no-shows. You see the full picture at a glance.',
    color: '#EF4444',
  },
];

export const USE_CASES = [
  { icon: '\uD83D\uDC87', title: 'Salons', stat: '28%', desc: 'average no-show rate in UAE salons. Reminders cut that to under 10%.' },
  { icon: '\uD83C\uDFE5', title: 'Clinics', stat: '4 hrs', desc: 'per week staff spend calling patients to confirm. Zero with automation.' },
  { icon: '\uD83D\uDCDA', title: 'Tutors', stat: '3x', desc: 'more rebookings when students get a follow-up after their session.' },
  { icon: '\uD83D\uDC85', title: 'Spas', stat: 'AED 600+', desc: 'average revenue recovered per month from prevented no-shows.' },
  { icon: '\u2708\uFE0F', title: 'Travel', stat: '92%', desc: 'of travelers appreciate pre-trip reminders (visa, docs, check-in).' },
];

export const PRICING = [
  {
    tier: 'Starter',
    price: 'Free',
    desc: 'Try it with basic reminders',
    features: ['1 active automation', 'Up to 50 reminders/month', 'WhatsApp or SMS', 'Basic dashboard'],
    highlight: false,
    badge: null,
    ctaLabel: 'Start Free',
  },
  {
    tier: 'Professional',
    price: 'AED 149',
    desc: "For businesses that can't afford no-shows",
    features: ['5 active automations', 'Unlimited reminders', 'WhatsApp + SMS', 'No-show tracking dashboard', 'Follow-up sequences', 'Priority support'],
    highlight: true,
    badge: 'Most Popular',
    ctaLabel: 'Get Started',
  },
  {
    tier: 'Business',
    price: 'AED 349',
    desc: 'Full automation suite, custom workflows',
    features: ['Unlimited automations', 'Custom workflow builds', 'Multi-location support', 'Lead capture + CRM sync', 'Dedicated account manager', 'Monthly performance report'],
    highlight: false,
    badge: null,
    ctaLabel: 'Get Started',
  },
];

export const QUIZ_STEPS = [
  {
    id: 'type',
    question: 'What kind of business do you run?',
    hint: 'We\'ll tailor your first automation to your industry.',
    options: [
      { value: 'salon', label: 'Salon / Barbershop', icon: '\uD83D\uDC87' },
      { value: 'clinic', label: 'Clinic / Medical', icon: '\uD83C\uDFE5' },
      { value: 'tutor', label: 'Tutor / Coach', icon: '\uD83D\uDCDA' },
      { value: 'spa', label: 'Spa / Wellness', icon: '\uD83D\uDC85' },
      { value: 'travel', label: 'Travel Agency', icon: '\u2708\uFE0F' },
      { value: 'other', label: 'Something else', icon: '\uD83C\uDFE2' },
    ],
  },
  {
    id: 'bookings',
    question: 'How many bookings do you handle per week?',
    hint: 'Helps us pick the right plan for your volume.',
    options: [
      { value: 'under20', label: 'Under 20', icon: '\uD83C\uDF31' },
      { value: '20to50', label: '20 – 50', icon: '\uD83D\uDCC8' },
      { value: '50to100', label: '50 – 100', icon: '\uD83D\uDE80' },
      { value: 'over100', label: 'Over 100', icon: '\u26A1' },
    ],
  },
  {
    id: 'pain',
    question: "What's your biggest headache right now?",
    hint: "We'll build your first automation around this.",
    options: [
      { value: 'noshows', label: 'No-shows & cancellations', icon: '\uD83D\uDEAB' },
      { value: 'reminders', label: 'Manually sending reminders', icon: '\u23F0' },
      { value: 'followups', label: 'Following up after visits', icon: '\uD83D\uDCACFollow-ups' },
      { value: 'confirmations', label: 'Booking confirmations', icon: '\u2705' },
    ],
  },
];

export const SECURITY_BLOCK = {
  heading: 'Built security-first, from the ground up',
  body:
    "Every account is fully isolated \u2014 one business can never see another\u2019s data, credentials, or automations. Access is enforced at the server, not just hidden in the interface. We run continuous security monitoring across our own infrastructure, so your customers\u2019 details stay yours alone.",
};
