import './App.css';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Phone, Star } from 'lucide-react';
import Footer from './components/Footer';
import FormPage from './FormPage';
import ThankYou from './ThankYou';
import { GOOGLE_LOGO_URL, LOGO_URL } from './shared/branding';

/* ─────────────────────────────────────────
   Shared animation variants
───────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

/* ─────────────────────────────────────────
   FadeInSection — reusable scroll-triggered
   wrapper using useInView
───────────────────────────────────────── */
function FadeInSection({ children, delay = 0, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   StaggerSection — stagger-reveals children
───────────────────────────────────────── */
function StaggerSection({ children, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}

/* ── tiny star component ── */
const Stars = ({ count = 5 }) => (
  <span className="stars">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="star-icon" aria-hidden="true" />
    ))}
  </span>
);

function App() {
  // 'home' | 'form' | 'thankyou'
  const [page, setPage] = useState('home');
  const [debtRange, setDebtRange] = useState('');
  const [userName, setUserName] = useState('');
  const [leadId, setLeadId] = useState(null);
  const [selectedDebt, setSelectedDebt] = useState('');

  // ── Navbar: hide on scroll down, show on scroll up ──
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setNavVisible(current < lastScrollY.current || current < 60);
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Sticky CTA: show after hero section leaves view ──
  const heroRef = useRef(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setCtaVisible(!entry.isIntersecting); },
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const goToForm = (range) => {
    setDebtRange(range || selectedDebt);
    setPage('form');
    // Use Lenis if available, fall back to native
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
  };

  const goToThankYou = ({ firstName, leadId: submissionId } = {}) => {
    setUserName(firstName || '');
    setLeadId(submissionId || null);
    setPage('thankyou');
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
  };

  // ── Render non-home pages ──
  if (page === 'form') {
    return (
      <FormPage
        debtRange={debtRange}
        onThankYou={(name) => goToThankYou(name)}
      />
    );
  }
  if (page === 'thankyou') {
    return (
      <ThankYou
        name={userName}
        leadId={leadId}
        onFindSolution={() => goToForm('')}
      />
    );
  }

  return (
    <div className="app">

      {/* ── NAVBAR ── */}
      <motion.div
        className="navbar-wrapper"
        animate={{ y: navVisible ? 0 : '-110%', opacity: navVisible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <nav className="navbar">
          <img src={LOGO_URL} alt="Debt Advisors Canada" className="brand-logo-img" />
          <a href="tel:12892013339" className="phone-btn">
            <Phone className="phone-btn-icon" aria-hidden="true" />
            <span>1-289-201-3339</span>
          </a>
        </nav>
      </motion.div>

      {/* ── HERO ── */}
      <div className="hero-wrapper" ref={heroRef}>
        <section className="hero">
          {/* Left copy — staggered children */}
          <motion.div
            className="hero-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="hero-heading" variants={fadeUp} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              Canadians Are Reducing Their Debt by{' '}
              <span className="highlight">60–80%</span>
            </motion.h1>
            <motion.p className="hero-sub" variants={fadeUp} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              A free, confidential assessment can help you understand where you
              stand and what may apply based on your situation.
            </motion.p>
            <motion.blockquote className="hero-quote" variants={fadeUp} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              "Over <strong>125,000 Canadians</strong> went through this process last year."
            </motion.blockquote>
            <motion.ul className="hero-checklist" variants={staggerContainer}>
              {[
                'Takes about 2 minutes',
                'No credit check to get started',
                'No obligation',
                'Private and confidential',
              ].map((item) => (
                <motion.li key={item} variants={fadeUp} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <CheckCircle2 className="check-icon" aria-hidden="true" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
            <motion.div className="google-badge" variants={fadeUp} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <img src={GOOGLE_LOGO_URL} alt="Google" className="google-badge-logo-img" />
              <div className="google-badge-info">
                <span className="badge-excellent">Excellent</span>
                <Stars />
                <span className="badge-rating">4.9 Star Ratings</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Debt card — scale + fade in */}
          <motion.div
            className="debt-card"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          >
            <p className="card-label">Let's understand your situation.</p>
            <h2 className="card-title">
              About how much total debt are you carrying right now?
            </h2>
            {[
              { value: '10k-20k', label: '$10,000—$20,000' },
              { value: '20k-50k', label: '$20,000—$50,000' },
              { value: '50k+',   label: '$50,000+' },
            ].map(opt => (
              <label
                key={opt.value}
                className={`debt-option${selectedDebt === opt.value ? ' selected' : ''}`}
                onClick={() => setSelectedDebt(opt.value)}
              >
                <span className={`radio-circle${selectedDebt === opt.value ? ' filled' : ''}`}></span>
                {opt.label}
              </label>
            ))}
            <button
              className="continue-btn"
              disabled={!selectedDebt}
              onClick={() => goToForm(selectedDebt)}
            >
              Continue →
            </button>
          </motion.div>
        </section>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="how-it-works">
        <div className="hiw-inner">
          <FadeInSection className="hiw-left">
            <p className="section-tag">How it works</p>
            <h2 className="hiw-heading">Getting help is simpler than you think</h2>
          </FadeInSection>

          <StaggerSection className="hiw-right">
            {[
              { n: 1, tag: 'Step one',   title: 'Quick Chat',
                body: 'Tell us about your situation. No credit check, no commitment.' },
              { n: 2, tag: 'Step two',   title: 'See What Applies to Your Situation',
                body: 'A specialist reviews your situation and walks you through what may be available for someone in your position.' },
              { n: 3, tag: 'Step three', title: 'You Pay Way Less',
                body: 'Most people pay 20—40 cents on the dollar through one affordable monthly payment.' },
            ].map(step => (
              <motion.div
                key={step.n}
                className="step-card"
                variants={fadeUp}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="step-num">{step.n}</div>
                <div>
                  <p className="step-tag">{step.tag}</p>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-body">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* ── TYPES OF DEBT ── */}
      <section className="debt-types">
        <FadeInSection>
          <h2 className="dt-heading">Types of Debt we can help with</h2>
          <p className="dt-sub">Debt specialists can help with almost any unsecured debt:</p>
        </FadeInSection>

        <StaggerSection className="dt-grid">
          {[
            { icon: '💳', label: 'Credit Cards',     sub: 'High-interest balances', color: '#e53935', bg: '#fde8e8' },
            { icon: '💵', label: 'Personal Loans',   sub: 'Unsecured loans',        color: '#43a047', bg: '#e8f5e9' },
            { icon: '⚡', label: 'Payday Loans',     sub: 'Short-term loans',       color: '#fb8c00', bg: '#fff3e0' },
            { icon: '🧾', label: 'Tax Debt',         sub: 'CRA debt',               color: '#e53935', bg: '#fde8e8' },
            { icon: '🏦', label: 'Credit Lines',     sub: 'Bank lines',             color: '#1e88e5', bg: '#e3f2fd' },
            { icon: '📋', label: 'Collection Bills', sub: 'Collection accounts',    color: '#8e24aa', bg: '#f3e5f5' },
            { icon: '🚗', label: 'Car Deficiency',   sub: 'Vehicle repossession',   color: '#fb8c00', bg: '#fff3e0' },
            { icon: '🏛️', label: 'Government Debt',  sub: 'Government arrears',     color: '#3949ab', bg: '#e8eaf6' },
            { icon: '💡', label: 'Utility Bills',    sub: 'Overdue utilities',      color: '#00897b', bg: '#e0f2f1' },
          ].map((item) => (
            <motion.div
              key={item.label}
              className="dt-card"
              style={{ '--accent': item.color }}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="dt-icon" style={{ background: item.bg, color: item.color }}>{item.icon}</div>
              <div>
                <p className="dt-name">{item.label}</p>
                <p className="dt-desc">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </StaggerSection>
      </section>

      {/* ── REVIEWS ── */}
      <section className="reviews">
        <FadeInSection>
          <h2 className="rv-heading">Trusted by Canadians Coast to Coast</h2>
          <div className="rv-google-bar">
            <span className="google-logo large">
              <span style={{color:'#4285F4'}}>G</span>
              <span style={{color:'#EA4335'}}>o</span>
              <span style={{color:'#FBBC05'}}>o</span>
              <span style={{color:'#4285F4'}}>g</span>
              <span style={{color:'#34A853'}}>l</span>
              <span style={{color:'#EA4335'}}>e</span>
            </span>
            <Stars />
            <span className="rv-score">4.9/5</span>
            <span className="rv-count">• 684 Google reviews</span>
            <span className="rv-verified">Verified Customers</span>
          </div>
        </FadeInSection>

        <StaggerSection className="rv-grid">
          {[
            { text: '"I found this experience very helpful and he sure took a load off my shoulders. He was very friendly and did not make me feel ashamed or at all. Bob Singh was just a pleasure to talk to!"',
              name: 'Debbie Kells.', location: 'Toronto, ON' },
            { text: '"They really helped me and is awesome! I had great experience. Bob Singh helped me and guided me through this process as I was overwhelmed. He was very patient and kind with me. Now I am calm knowing this has been taken care of and now totally relaxed. Now I can easily manage my budget."',
              name: 'Kelly Sweers.', location: 'Vancouver, BC' },
            { text: '"Andy Goss was an amazing Representative and he made my day the best day ever by taking away the stress that I persevered! Thank you Andy, for your patience and attendance of taking care of my situation the best way possible! We need more people like you helping others in situations like mine! You are a God send in mine! Thanks again!"',
              name: 'Jenny Ali.', location: 'Calgary, AB' },
          ].map((rv) => (
            <motion.div
              key={rv.name}
              className="rv-card"
              variants={fadeUp}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="rv-text">{rv.text}</p>
              <div className="rv-footer">
                <p className="rv-name">{rv.name}</p>
                <Stars />
                <p className="rv-location">{rv.location}</p>
              </div>
            </motion.div>
          ))}
        </StaggerSection>
      </section>

      <Footer onCtaClick={() => goToForm('')} />

      {/* ── STICKY FLOATING CTA — appears after hero leaves view ── */}
      <AnimatePresence>
        {ctaVisible && (
          <motion.div
            className="sticky-cta cta-visible"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sticky-cta-inner">
              <button className="find-btn" onClick={() => goToForm('')}>
                <span>Find My Solution</span>
                <ArrowRight className="btn-arrow-icon" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
