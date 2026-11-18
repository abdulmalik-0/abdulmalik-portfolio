import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '../lang.jsx';
import { LINKS } from '../content.js';
import { gsap, ScrollTrigger, prefersReducedMotion, scrollToElement } from '../lib/motion.js';
import SplitText from './reactbits/SplitText.jsx';
import Magnet from './reactbits/Magnet.jsx';
import ShinyText from './reactbits/ShinyText.jsx';
import StarBorder from './reactbits/StarBorder.jsx';
import RoomDetail from './RoomDetail.jsx';

// Which side of its dot each hotspot's label sits on (screen sides, the same in both languages),
// chosen so the labels do not cover each other over the room.
const LABEL_SIDE = ['top', 'top', 'left', 'top', 'top', 'right'];

const WIDE = '(min-width: 1000px)';

/** True on screens wide enough for the room to sit beside the text, with its labels. */
function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches);
  useEffect(() => {
    const query = window.matchMedia(WIDE);
    const change = () => setWide(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  return wide;
}

export default function Hero({ onViewCv }) {
  const { t, lang } = useLang();
  const heroRef = useRef(null);
  const roomRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const hotspotRefs = useRef([]);
  const panelRef = useRef(null);
  const wide = useWide();
  const [status, setStatus] = useState('loading'); // loading | live | still-image
  // The open track: its corner fills the room and its details panel is open (-1: the whole room).
  const [focus, setFocus] = useState(-1);
  const [hovered, setHovered] = useState(-1); // label pointed at or focused
  const [pointed, setPointed] = useState(-1); // corner of the room under the pointer
  const active = hovered >= 0 ? hovered : pointed;
  const count = t.tracks.length;
  // Where keyboard focus goes back to when the panel closes: { kind: 'pin' | 'legend', index }
  const returnRef = useRef(null);

  const openTrack = useCallback((index, returnTo = null) => {
    returnRef.current = returnTo;
    setHovered(-1);
    setFocus(index);
  }, []);
  const closeTrack = useCallback((restoreFocus = true) => {
    if (!restoreFocus) returnRef.current = null;
    setFocus(-1);
  }, []);
  const stepTrack = useCallback(step => setFocus(current => (current + step + count) % count), [count]);
  // The scene's event handlers are set up once, so they reach the latest of these through a ref.
  const latest = useRef({});
  latest.current = { focus, openTrack, closeTrack };

  // The open (or pointed-at) track's corner of the room lights up.
  useEffect(() => {
    if (sceneRef.current) sceneRef.current.highlight = focus >= 0 ? focus : active;
  }, [focus, active, status]);

  // A close-up fits in the part of the room the details panel leaves free: beside the panel on
  // wide screens (the panel sits on the side nearest the text), the whole room on narrow ones.
  useEffect(() => {
    if (!sceneRef.current) return;
    const textOnLeft = lang !== 'ar';
    sceneRef.current.setFrame(wide ? { cx: textOnLeft ? 0.73 : 0.27, cy: 0.5, w: 0.46, h: 0.84 } : { cx: 0.5, cy: 0.5, w: 0.9, h: 0.86 });
  }, [wide, lang, status]);

  // The camera flies to the open track's corner, or back out to the whole room.
  useEffect(() => {
    if (sceneRef.current) sceneRef.current.focus(focus);
  }, [focus, status]);

  // Opening moves keyboard focus into the panel; closing puts it back on what opened it.
  useEffect(() => {
    if (focus >= 0) {
      if (panelRef.current) panelRef.current.focus({ preventScroll: true });
      // On narrow screens the panel opens under the room: bring the room into view.
      if (!wide && roomRef.current && roomRef.current.getBoundingClientRect().top < 80) scrollToElement(roomRef.current, -88);
      return;
    }
    const back = returnRef.current;
    returnRef.current = null;
    const lost = !document.activeElement || document.activeElement === document.body;
    if (back && lost) {
      const target = heroRef.current.querySelector(`[data-return="${back.kind}-${back.index}"]`);
      if (target) target.focus({ preventScroll: true });
    }
  }, [focus, wide]);

  // Escape closes the panel (unless a dialog, such as the CV, is what Escape is closing).
  useEffect(() => {
    if (focus < 0) return undefined;
    const onKey = event => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) closeTrack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus, closeTrack]);

  useEffect(() => {
    const hero = heroRef.current;
    const box = roomRef.current;
    const reduced = prefersReducedMotion();
    const cleanups = [];
    let disposed = false;

    // The text eases in right away; it does not wait for the 3D code.
    if (!reduced) {
      const copyIn = gsap.from(hero.querySelectorAll('.hero-badge, .hero-lead, .hero-cta'), {
        opacity: 0,
        y: 18,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.35,
        ease: 'power3.out',
        clearProps: 'opacity,transform'
      });
      cleanups.push(() => copyIn.kill());
    }

    // three.js is the heaviest part of the page, so the room loads as its own chunk after first paint,
    // then its furniture models; the room is built once both are in.
    import('../three/ServerRoomScene.js')
      .then(async module => [module, await module.loadRoomModels()])
      .then(([module, models]) => {
        if (disposed) return;
        let scene;
        try {
          scene = new module.ServerRoomScene(canvasRef.current, box, hotspotRefs.current, models);
        } catch {
          setStatus('still-image'); // no WebGL
          return;
        }
        sceneRef.current = scene;
        // Development only: lets the scene be inspected from the browser console.
        if (import.meta.env.DEV) window.__serverRoom = scene;
        cleanups.push(() => scene.dispose());
        scene.still = reduced;
        scene.layout();
        setStatus('live');

        // GSAP's ticker drives the render loop, so the room stays in step with every tween.
        const tick = time => scene.update(time);
        gsap.ticker.add(tick);
        cleanups.push(() => gsap.ticker.remove(tick));

        // The room builds itself: base, walls, racks, then everything else drops into place.
        if (reduced) {
          scene.clock = module.ASSEMBLED_AT;
        } else {
          const build = gsap.to(scene, { clock: module.ASSEMBLED_AT, duration: module.ASSEMBLED_AT, ease: 'none', delay: 0.2 });
          cleanups.push(() => build.kill());
        }

        // Pointing at a corner of the room lights it and shows its label; clicking opens it.
        // Clicking empty space while a corner is open goes back to the whole room.
        const canvas = canvasRef.current;
        let lastPointed = -1;
        const pointAt = track => {
          if (track === lastPointed) return;
          lastPointed = track;
          setPointed(track);
          canvas.style.cursor = track >= 0 ? 'pointer' : '';
        };
        const onCanvasMove = event => {
          if (event.pointerType !== 'touch') pointAt(scene.pick(event.clientX, event.clientY));
        };
        const onCanvasLeave = () => pointAt(-1);
        const onCanvasClick = event => {
          const track = scene.pick(event.clientX, event.clientY);
          const { focus: open, openTrack: openIt, closeTrack: closeIt } = latest.current;
          if (track >= 0) {
            if (track !== open) openIt(track);
          } else if (open >= 0) {
            closeIt(false);
          }
        };
        canvas.addEventListener('pointermove', onCanvasMove, { passive: true });
        canvas.addEventListener('pointerleave', onCanvasLeave);
        canvas.addEventListener('click', onCanvasClick);
        cleanups.push(() => {
          canvas.removeEventListener('pointermove', onCanvasMove);
          canvas.removeEventListener('pointerleave', onCanvasLeave);
          canvas.removeEventListener('click', onCanvasClick);
        });

        // The pointer turns the room a little.
        const onPointer = event => {
          if (event.pointerType === 'touch') return;
          const r = hero.getBoundingClientRect();
          scene.pointer.x = gsap.utils.clamp(-1, 1, (event.clientX - (r.left + r.width / 2)) / (r.width / 2));
          scene.pointer.y = gsap.utils.clamp(-1, 1, (event.clientY - (r.top + r.height / 2)) / (r.height / 2));
        };
        window.addEventListener('pointermove', onPointer, { passive: true });
        cleanups.push(() => window.removeEventListener('pointermove', onPointer));

        // Scrolling away turns the room and moves in on it.
        const scrollLink = ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          onUpdate: self => {
            scene.scroll = self.progress;
          }
        });
        cleanups.push(() => scrollLink.kill());

        const visibility = new IntersectionObserver(([entry]) => {
          scene.visible = entry.isIntersecting;
        });
        visibility.observe(hero);
        cleanups.push(() => visibility.disconnect());

        let resizeTimer = 0;
        const resize = new ResizeObserver(() => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => scene.layout(), 100);
        });
        resize.observe(box);
        cleanups.push(() => {
          clearTimeout(resizeTimer);
          resize.disconnect();
        });
      })
      .catch(() => {
        if (!disposed) setStatus('still-image');
      });

    return () => {
      disposed = true;
      cleanups.forEach(fn => fn());
      sceneRef.current = null;
    };
  }, []);

  const leave = index => setHovered(current => (current === index ? -1 : current));

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="hero-badge">
            <span className="status-dot" aria-hidden="true" />
            <ShinyText key={lang} text={t.hero.badge} color="#C3CCE0" shineColor="#FFFFFF" speed={3} />
          </p>
          <SplitText
            key={lang}
            tag="h1"
            className="hero-name"
            text={t.name}
            // Arabic letters join, so Arabic splits by word; Latin splits by letter.
            splitType={lang === 'ar' ? 'words' : 'chars'}
            delay={lang === 'ar' ? 140 : 32}
            duration={0.9}
            trigger="load"
            textAlign="start"
          />
          <p className="hero-lead">{t.hero.lead}</p>
          <div className="hero-cta">
            <Magnet padding={50} magnetStrength={5}>
              <button type="button" className="btn btn-solid" onClick={onViewCv}>
                {t.hero.viewCv}
              </button>
            </Magnet>
            <Magnet padding={50} magnetStrength={5}>
              {/* A point of light travels around this button's border. */}
              <StarBorder
                as="a"
                href={LINKS.cv}
                download
                className="btn-star"
                color="#B9C8FF"
                duration={5}
                radius={12}
                backgroundColor="rgba(255, 255, 255, 0.04)"
                textColor="#F2F5FB"
                borderColor="rgba(255, 255, 255, 0.16)"
              >
                {t.hero.downloadCv}
              </StarBorder>
            </Magnet>
            <span className="hero-social">
              <a className="icon-link" href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
              </a>
              <a className="icon-link" href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                </svg>
              </a>
            </span>
          </div>
        </div>

        <div className={`room is-${status}${focus >= 0 ? ' is-focused' : ''}`} ref={roomRef}>
          <canvas className="room-canvas" ref={canvasRef} aria-hidden="true" />
          {status === 'still-image' && <img className="room-still" src="/assets/server-room.png" alt="" width="1200" height="1000" />}

          {/* Over the 3D room: one label per track, kept on its object by the scene. */}
          <ul className={`hotspots${active >= 0 ? ' has-active' : ''}`} aria-label={t.hero.roomLabel}>
            {t.tracks.map((track, i) => (
              <li
                key={i}
                className={`hotspot c${i} side-${LABEL_SIDE[i]}${active === i ? ' is-active' : ''}`}
                ref={el => {
                  hotspotRefs.current[i] = el;
                }}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => leave(i)}
              >
                <button
                  type="button"
                  className="hotspot-pin"
                  data-return={`pin-${i}`}
                  aria-expanded={focus === i}
                  onFocus={() => setHovered(i)}
                  onBlur={() => leave(i)}
                  onClick={() => openTrack(i, { kind: 'pin', index: i })}
                >
                  <span className="dot" aria-hidden="true" />
                  <span className="hotspot-label">{track.tool}</span>
                </button>
                <span className="hotspot-card">
                  <span className="hotspot-track">{track.name}</span>
                  <strong>{track.title}</strong>
                  <span>{track.note}</span>
                </span>
              </li>
            ))}
          </ul>

          {status === 'live' && focus < 0 && (
            <p className="room-hint" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2.5l9 4-3.8 1.4L6.8 12z" />
                <path d="M8.4 8.1l3.4 3.4" />
              </svg>
              {wide ? t.hero.hint : t.hero.hintTouch}
            </p>
          )}

          {wide && focus >= 0 && (
            <RoomDetail ref={panelRef} index={focus} count={count} track={t.tracks[focus]} labels={t.hero} onClose={() => closeTrack()} onStep={stepTrack} />
          )}
        </div>

        {/* Narrow screens: the open track's details under the room, in place of the list */}
        {!wide && focus >= 0 && (
          <RoomDetail ref={panelRef} index={focus} count={count} track={t.tracks[focus]} labels={t.hero} onClose={() => closeTrack()} onStep={stepTrack} />
        )}

        {/* Narrow screens (and the still picture) list the tracks under the room; each opens its corner. */}
        {(wide || focus < 0) && (
          <ul className={`room-legend${status === 'still-image' ? ' is-always' : ''}`}>
            {t.tracks.map((track, i) => (
              <li key={i} className={`c${i}`}>
                <button type="button" className="room-legend-item" data-return={`legend-${i}`} onClick={() => openTrack(i, { kind: 'legend', index: i })}>
                  <span className="dot" aria-hidden="true" />
                  <span className="room-legend-text">
                    <strong>{track.title}</strong>
                    <span>{track.note}</span>
                  </span>
                  <svg className="room-legend-chevron" aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5.5 2.5L10 7l-4.5 4.5" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
