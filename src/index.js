import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './ui.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Lenis from 'lenis';

// Expose a global lenis instance so any component can call
// window.__lenis.scrollTo(0) instead of window.scrollTo()
function LenisBootstrap() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Expose globally so page transitions can scroll to top smoothly
    window.__lenis = lenis;

    // Sync Framer Motion's useScroll with Lenis position
    // by directly updating the scroll position — do NOT re-dispatch
    // a native 'scroll' event here, that causes an infinite loop where
    // Lenis picks up its own dispatched event and fires again.
    lenis.on('scroll', ({ scroll }) => {
      // Framer Motion reads from document.documentElement.scrollTop,
      // so keep it in sync manually (read-only in most browsers — skip if it throws)
      try { document.documentElement.scrollTop = scroll; } catch (_) {}
    });

    let frame = 0;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    // Disable browser smooth-scroll so Lenis owns it entirely
    document.documentElement.style.scrollBehavior = 'auto';
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LenisBootstrap />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
