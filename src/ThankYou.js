import { motion } from 'framer-motion';
import { CheckCircle2, Mail, MessageCircleMore, Phone, ShieldCheck } from 'lucide-react';
import { logContactClick } from './lib/supabaseRest';
import Footer from './components/Footer';
import { LOGO_URL } from './shared/branding';
import './FormPage.css';
import { Badge } from './components/ui/badge';
import { Card } from './components/ui/card';
import { Separator } from './components/ui/separator';

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

export default function ThankYou({ name, leadId, onFindSolution }) {
  const trackContactClick = async (channel) => {
    // Fire-and-forget analytics — errors are swallowed in logContactClick
    logContactClick({ lead_id: leadId, channel }).catch(() => {});
  };

  return (
    <div className="fp-page">
      <Navbar />

      <div className="fp-body">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
        <Card className="fp-card ty-card">
          {/* Checkmark circle */}
          <div className="ty-check">
            <CheckCircle2 className="ty-check-icon" aria-hidden="true" />
          </div>

          <h2 className="ty-title">You're All Set, {name || 'there'}!</h2>
          <p className="ty-sub">
            Thank you for submitting your information. A Debt Advisors Canada specialist
            will review your situation and reach out to you shortly — usually within 1 business day.
          </p>

          <Separator className="ty-divider" />

          <p className="ty-contact-heading">Prefer to reach us directly?</p>

          <a
            href="tel:12892013339"
            className="ty-contact-row"
            onClick={() => { trackContactClick('phone'); }}
          >
            <span className="ty-contact-icon"><Phone aria-hidden="true" /></span>
            <div>
              <p className="ty-contact-label">Call Us</p>
              <p className="ty-contact-value">1-289-201-3339</p>
            </div>
          </a>

          <a
            href="mailto:info@debtadvisorscanada.ca"
            className="ty-contact-row"
            onClick={() => { trackContactClick('email'); }}
          >
            <span className="ty-contact-icon"><Mail aria-hidden="true" /></span>
            <div>
              <p className="ty-contact-label">Email Us</p>
              <p className="ty-contact-value">info@debtadvisorscanada.ca</p>
            </div>
          </a>

          <Separator className="ty-divider" />

          <div className="ty-badges">
            <Badge className="ty-badge">
              <ShieldCheck className="ty-badge-icon" aria-hidden="true" /> 100% Confidential
            </Badge>
            <Badge className="ty-badge">
              <CheckCircle2 className="ty-badge-icon" aria-hidden="true" /> No Credit Check
            </Badge>
            <Badge className="ty-badge">
              <MessageCircleMore className="ty-badge-icon" aria-hidden="true" /> Free Assessment
            </Badge>
          </div>
        </Card>
        </motion.div>
      </div>

      <Footer onCtaClick={onFindSolution} />
    </div>
  );
}
