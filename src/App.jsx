import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion, startSmoothScroll } from './lib/motion.js';
import { useLang } from './lang.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import TechBand from './components/TechBand.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Skills from './components/Skills.jsx';
import Education from './components/Education.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import CvDialog from './components/CvDialog.jsx';
import ClickSpark from './components/reactbits/ClickSpark.jsx';

export default function App() {
  const { lang } = useLang();
  const [cvOpen, setCvOpen] = useState(false);
  const glowRef = useRef(null);

  // Lenis smooth scrolling for the whole page (it turns itself off for reduced motion).
  useEffect(() => startSmoothScroll(), []);

  // Section heights change when images load or the language switches, so scroll-linked
  // animations need their start and end points measured again.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const id = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('load', refresh);
    };
  }, [lang]);

  // A soft light that follows the pointer across the page background.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const glow = glowRef.current;
    const toX = gsap.quickTo(glow, 'x', { duration: 0.8, ease: 'power3.out' });
    const toY = gsap.quickTo(glow, 'y', { duration: 0.8, ease: 'power3.out' });
    const move = event => {
      if (event.pointerType === 'touch') return;
      toX(event.clientX);
      toY(event.clientY);
      glow.style.opacity = '1';
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    // Clicking anywhere throws a few sparks.
    <ClickSpark className="app" sparkColor="#DCE6FF" sparkSize={10} sparkRadius={22} sparkCount={8} duration={420}>
      {/* The page ground: colour, ambient glows, a faint grid, grain and the pointer light. */}
      <div className="page-bg" aria-hidden="true">
        <div className="page-grid" />
        <div className="cursor-glow" ref={glowRef} />
      </div>

      <Header />
      <main>
        <Hero onViewCv={() => setCvOpen(true)} />
        <TechBand />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <CvDialog open={cvOpen} onClose={() => setCvOpen(false)} />
    </ClickSpark>
  );
}
