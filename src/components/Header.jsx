import { useEffect, useRef, useState } from 'react';
import { useLang } from '../lang.jsx';
import { gsap, ScrollTrigger } from '../lib/motion.js';

const SECTIONS = ['about', 'experience', 'projects', 'skills', 'education', 'contact'];

export default function Header() {
  const { t, lang, toggle } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(null);
  const navRef = useRef(null);
  const pillRef = useRef(null);
  const progressRef = useRef(null);

  // Track which section is on screen, and how far down the page the reader is.
  useEffect(() => {
    const triggers = SECTIONS.map(id =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: self => {
          if (self.isActive) setActive(id);
        }
      })
    );
    triggers.push(
      ScrollTrigger.create({
        trigger: '#top',
        start: 'top top',
        end: 'bottom 50%',
        onToggle: self => {
          if (self.isActive) setActive(null);
        }
      })
    );
    const progress = gsap.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } }
    );
    return () => {
      triggers.forEach(trigger => trigger.kill());
      if (progress.scrollTrigger) progress.scrollTrigger.kill();
      progress.kill();
    };
  }, []);

  // Slide the highlight pill under the link of the section in view.
  useEffect(() => {
    const pill = pillRef.current;
    const link = active ? navRef.current.querySelector(`[data-id="${active}"]`) : null;
    if (!link) {
      gsap.to(pill, { opacity: 0, duration: 0.25 });
      return;
    }
    gsap.to(pill, { x: link.offsetLeft, width: link.offsetWidth, opacity: 1, duration: 0.45, ease: 'power3.out' });
  }, [active, lang]);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <header className="site-header">
        <div className="bar">
          <a className="wordmark" href="#top" onClick={() => setMenuOpen(false)}>
            {t.name}
          </a>
          <nav className={`nav${menuOpen ? ' is-open' : ''}`} id="site-nav" aria-label={t.nav.sections} ref={navRef}>
            <span className="nav-pill" ref={pillRef} aria-hidden="true" />
            {SECTIONS.map(id => (
              <a
                key={id}
                data-id={id}
                href={`#${id}`}
                className={active === id ? 'is-active' : undefined}
                aria-current={active === id ? 'true' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {t.nav[id]}
              </a>
            ))}
          </nav>
          <div className="bar-end">
            <button className="lang" type="button" onClick={toggle} lang={lang === 'ar' ? 'en' : 'ar'}>
              {t.otherLanguage}
            </button>
            <button
              className="menu-button"
              type="button"
              aria-label={t.nav.menu}
              aria-expanded={menuOpen}
              aria-controls="site-nav"
              onClick={() => setMenuOpen(open => !open)}
            >
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
