import { ArrowRight } from 'lucide-react';
import { LOGO_URL } from '../shared/branding';
import './Footer.css';

const DISCLAIMER_1 =
  'Debt Advisors Canada provides debt assessment and referral services. We are not a Licensed Insolvency Trustee firm and do not administer consumer proposals or bankruptcies.';

const DISCLAIMER_2 =
  'Information submitted through this website may be reviewed by our team and, where appropriate, referred to a third-party service provider for further review. Debt Advisors Canada may receive compensation for referrals. Options, fees, timelines, and outcomes depend on your individual situation.';

export default function Footer({ onCtaClick }) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-logo-wrap">
          <img src={LOGO_URL} alt="Debt Advisors Canada" className="site-footer-logo-img" />
        </div>

        <hr className="site-footer-divider" aria-hidden="true" />

        <div className="site-footer-text">
          <p className="site-footer-copy">© 2026 Debt Advisors Canada. All rights reserved.</p>
          <p className="site-footer-disc">{DISCLAIMER_1}</p>
          <p className="site-footer-disc">{DISCLAIMER_2}</p>
        </div>

        {/* <div className="site-footer-cta-wrap">
          <button type="button" className="site-footer-cta" onClick={onCtaClick}>
            <span>Find My Solution</span>
            <ArrowRight className="site-footer-cta-icon" aria-hidden="true" />
          </button>
        </div> */}
      </div>
    </footer>
  );
}
