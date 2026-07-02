import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import './FormPage.css';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { createLeadSubmission } from './lib/supabaseRest';
import Footer from './components/Footer';
import { LOGO_URL } from './shared/branding';
import { validateLeadForm } from './utils/validation';

/* ── Shared navbar ── */
const Navbar = () => (
  <div className="fp-navbar-wrapper">
    <nav className="fp-navbar">
      <img src={LOGO_URL} alt="Debt Advisors Canada" className="fp-brand-logo-img" />
      <a href="tel:12892013339" className="fp-phone-btn">
        <Phone className="fp-phone-btn-icon" aria-hidden="true" />
        <span>1-289-201-3339</span>
      </a>
    </nav>
  </div>
);

/* ── Progress bar ── */
const Progress = ({ step, total }) => {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="fp-progress-wrap">
      <div className="fp-progress-bar">
        <div className="fp-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="fp-progress-label">{pct}% Complete</span>
    </div>
  );
};

/* ════════════════════════
   STEP 1 — Contact Info
════════════════════════ */
const Step1 = ({ data, onChange, onNext, errors, touched, onBlur, canContinue }) => {
  const provinces = [
    'Alberta','British Columbia','Manitoba','New Brunswick',
    'Newfoundland and Labrador','Nova Scotia','Ontario',
    'Prince Edward Island','Quebec','Saskatchewan',
  ];

  const showError = (field) => Boolean(touched[field]) && Boolean(errors[field]);

  return (
    <Card className="fp-card">
      <Progress step={1} total={3} />
      <h2 className="fp-card-title">Let's Get You Connected</h2>
      <p className="fp-card-sub">Enter your details so our team can follow up about your assessment.</p>

      <div className="fp-row">
        <div className="fp-field">
          <label>First Name</label>
          <div className={`fp-input-shell${showError('firstName') ? ' fp-input-shell--error' : ''}`}>
            <UserRound className="fp-input-icon" aria-hidden="true" />
            <input
              placeholder="First Name"
              value={data.firstName}
              onChange={e => onChange('firstName', e.target.value)}
              onBlur={() => onBlur('firstName')}
              aria-invalid={showError('firstName')}
            />
          </div>
          {showError('firstName') && <p className="fp-field-error">{errors.firstName}</p>}
        </div>
        <div className="fp-field">
          <label>Last Name</label>
          <div className={`fp-input-shell${showError('lastName') ? ' fp-input-shell--error' : ''}`}>
            <UserRound className="fp-input-icon" aria-hidden="true" />
            <input
              placeholder="Last Name"
              value={data.lastName}
              onChange={e => onChange('lastName', e.target.value)}
              onBlur={() => onBlur('lastName')}
              aria-invalid={showError('lastName')}
            />
          </div>
          {showError('lastName') && <p className="fp-field-error">{errors.lastName}</p>}
        </div>
      </div>

      <div className="fp-field">
        <label>Phone Number</label>
        <div className={`fp-input-shell fp-phone-shell${showError('phone') ? ' fp-input-shell--error' : ''}`}>
          <Phone className="fp-input-icon" aria-hidden="true" />
          <span className="fp-phone-prefix">+1</span>
          <input
            placeholder="(___) ___-____"
            value={data.phone}
            onChange={e => onChange('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            aria-invalid={showError('phone')}
          />
        </div>
        {showError('phone') && <p className="fp-field-error">{errors.phone}</p>}
      </div>

      <div className="fp-field">
        <label>Email</label>
        <div className={`fp-input-shell${showError('email') ? ' fp-input-shell--error' : ''}`}>
          <Mail className="fp-input-icon" aria-hidden="true" />
          <input
            type="email"
            placeholder="email@example.com"
            value={data.email}
            onChange={e => onChange('email', e.target.value)}
            onBlur={() => onBlur('email')}
            aria-invalid={showError('email')}
          />
        </div>
        {showError('email') && <p className="fp-field-error">{errors.email}</p>}
      </div>

      <div className="fp-field">
        <label>Province</label>
        <div className={`fp-input-shell fp-select-shell${showError('province') ? ' fp-input-shell--error' : ''}`}>
          <MapPin className="fp-input-icon" aria-hidden="true" />
          <Select
            value={data.province}
            onValueChange={value => onChange('province', value)}
          >
            <SelectTrigger
              className="fp-select-trigger"
              onBlur={() => onBlur('province')}
              aria-invalid={showError('province')}
            >
              <SelectValue placeholder="Select Your Province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {showError('province') && <p className="fp-field-error">{errors.province}</p>}
      </div>

      <Button className={`fp-continue-btn${canContinue ? '' : ' fp-continue-btn--inactive'}`} onClick={onNext} type="button">
        Continue <ArrowRight className="fp-btn-icon" aria-hidden="true" />
      </Button>
    </Card>
  );
};

/* ════════════════════════
   STEP 2 — Debt Details
════════════════════════ */
const Step2 = ({ data, onChange, onNext, onBack }) => {
  const employments = [
    'Employed full-time', 'Employed part-time',
    'Self-employed', 'Unemployed', 'Retired', 'On disability',
  ];
  const creditors = ['1–2', '3–5', '6–10', '10+'];

  const valid = data.employment && data.creditors && data.behindPayments !== '';

  return (
    <Card className="fp-card">
      <Progress step={2} total={3} />
      <h2 className="fp-card-title">Tell Us About Your Situation</h2>
      <p className="fp-card-sub">This helps us find the best options available to you.</p>

      <div className="fp-field">
        <label>Employment Status</label>
        <div className="fp-radio-group">
          {employments.map(e => (
            <label key={e} className={`fp-radio-pill${data.employment === e ? ' active' : ''}`}>
              <input
                type="radio" name="employment" value={e}
                checked={data.employment === e}
                onChange={() => onChange('employment', e)}
              />
              {e}
            </label>
          ))}
        </div>
      </div>

      <div className="fp-field">
        <label>How many creditors do you owe?</label>
        <div className="fp-radio-group">
          {creditors.map(c => (
            <label key={c} className={`fp-radio-pill${data.creditors === c ? ' active' : ''}`}>
              <input
                type="radio" name="creditors" value={c}
                checked={data.creditors === c}
                onChange={() => onChange('creditors', c)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div className="fp-field">
        <label>Are you behind on any payments?</label>
        <div className="fp-radio-group">
          {['Yes', 'No'].map(v => (
            <label key={v} className={`fp-radio-pill${data.behindPayments === v ? ' active' : ''}`}>
              <input
                type="radio" name="behind" value={v}
                checked={data.behindPayments === v}
                onChange={() => onChange('behindPayments', v)}
              />
              {v}
            </label>
          ))}
        </div>
      </div>

      <div className="fp-btn-row">
          <Button className="fp-back-btn" onClick={onBack} type="button" variant="ghost">
            <ArrowLeft className="fp-btn-icon" aria-hidden="true" />
            Back
          </Button>
          <Button className="fp-continue-btn fp-continue-flex" disabled={!valid} onClick={onNext} type="button">
            Continue <ArrowRight className="fp-btn-icon" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
};

/* ════════════════════════
   STEP 3 — Review & Submit
════════════════════════ */
const Step3 = ({ allData, onBack, onSubmit, isSubmitting }) => (
  <Card className="fp-card">
    <Progress step={3} total={3} />
    <h2 className="fp-card-title">Review Your Information</h2>
    <p className="fp-card-sub">Please confirm your details before submitting.</p>

    <div className="fp-review-block">
      <h3 className="fp-review-section">Contact Details</h3>
      <div className="fp-review-row"><span>Name</span><span>{allData.firstName} {allData.lastName}</span></div>
      <div className="fp-review-row"><span>Phone</span><span>+1 {allData.phone}</span></div>
      <div className="fp-review-row"><span>Email</span><span>{allData.email}</span></div>
      <div className="fp-review-row"><span>Province</span><span>{allData.province}</span></div>
    </div>

    <div className="fp-review-block">
      <h3 className="fp-review-section">Debt Situation</h3>
      <div className="fp-review-row"><span>Debt Range</span><span>{allData.debtRange}</span></div>
      <div className="fp-review-row"><span>Employment</span><span>{allData.employment}</span></div>
      <div className="fp-review-row"><span>Creditors</span><span>{allData.creditors}</span></div>
      <div className="fp-review-row"><span>Behind on Payments</span><span>{allData.behindPayments}</span></div>
    </div>

    <p className="fp-consent">
      By submitting, you consent to being contacted by a Debt Advisors Canada specialist. 
      Your information is kept strictly confidential.
    </p>

    <div className="fp-btn-row">
      <Button className="fp-back-btn" onClick={onBack} type="button" variant="ghost"
        disabled={isSubmitting}>
        <ArrowLeft className="fp-btn-icon" aria-hidden="true" />
        Back
      </Button>
      <Button
        className="fp-submit-btn"
        onClick={onSubmit}
        type="button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting…' : <>Submit <ArrowRight className="fp-btn-icon" aria-hidden="true" /></>}
      </Button>
    </div>
  </Card>
);

/* ─────────────────────────────────────────
   Directional slide variants for step transitions
───────────────────────────────────────── */
const stepVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -48 : 48 }),
};

const stepTransition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] };

/* ════════════════════════
   MAIN FormPage
════════════════════════ */
export default function FormPage({ debtRange, onThankYou }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    debtRange: debtRange || '',
    firstName: '', lastName: '', phone: '', email: '', province: '',
    employment: '', creditors: '', behindPayments: '',
  });

  const update = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  const markTouched = (key) => setTouched(prev => ({ ...prev, [key]: true }));

  const scrollTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 0.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = () => { setDirection(1);  setStep(s => s + 1); scrollTop(); };
  const back = () => { setDirection(-1); setStep(s => s - 1); scrollTop(); };

  const step1Errors = validateLeadForm(formData);
  const step1Valid = Object.keys(step1Errors).length === 0;

  const submitStep1 = () => {
    setSubmitAttempted(true);
    if (step1Valid) next();
  };

  const submit = async () => {
    // Prevent double-submit
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      first_name: formData.firstName,
      last_name:  formData.lastName,
      phone:      formData.phone,
      email:      formData.email,
      province:   formData.province,
      debt_range: formData.debtRange,
      employment: formData.employment,
      creditors:  formData.creditors,
      behind_payments: formData.behindPayments,
    };

    try {
      const { data } = await createLeadSubmission(payload);
      const lead = Array.isArray(data) ? data[0] : data;
      onThankYou({ firstName: formData.firstName, leadId: lead?.id || null });
    } catch (error) {
      console.error('Failed to submit lead:', error);
      // Still navigate on error so user isn't stuck
      onThankYou({ firstName: formData.firstName, leadId: null });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fp-page">
      <Navbar />

      <div className="fp-body">
        {/* overflow-hidden on a wrapper keeps sliding steps from causing horizontal scroll */}
        <div style={{ width: '100%', maxWidth: 500, overflow: 'hidden' }}>
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
              >
                <Step1
                  data={formData}
                  onChange={update}
                  onNext={submitStep1}
                  errors={step1Errors}
                  touched={submitAttempted ? {
                    firstName: true, lastName: true,
                    phone: true, email: true, province: true,
                    ...touched,
                  } : touched}
                  onBlur={markTouched}
                  canContinue={step1Valid}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
              >
                <Step2 data={formData} onChange={update} onNext={next} onBack={back} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
              >
                <Step3 allData={formData} onBack={back} onSubmit={submit} isSubmitting={isSubmitting} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer
        onCtaClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
