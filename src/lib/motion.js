// One place for the motion stack: GSAP drives every animation frame, Lenis smooths
// the scroll, and ScrollTrigger reads Lenis's position so scroll-linked motion stays in sync.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const HEADER_HEIGHT = 96; // the floating header plus its gap from the top
let lenis = null;

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Starts smooth scrolling for the whole page. Returns a cleanup function. */
export function startSmoothScroll() {
  lenis = new Lenis({
    lerp: 0.1,
    // In-page links (#experience …) glide to their section and stop below the sticky header.
    anchors: { offset: -HEADER_HEIGHT }
  });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = time => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

/** Glides the page so `element` sits just below the header (offset is extra space, in pixels). */
export function scrollToElement(element, offset = -HEADER_HEIGHT) {
  if (lenis) lenis.scrollTo(element, { offset, duration: 0.9, immediate: prefersReducedMotion() });
  else element.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Pauses or resumes page scrolling (used while the CV dialog is open). */
export function setScrollLocked(locked) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export { gsap, ScrollTrigger };
