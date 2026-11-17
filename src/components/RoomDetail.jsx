import { forwardRef, useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion.js';

/**
 * Text that writes itself out. The full text stays in the layout (transparent, and what screen
 * readers read), so the panel does not grow line by line; the typed copy is drawn over it.
 */
function Typed({ text }) {
  return (
    <span className="typed">
      <span className="typed-ghost">{text}</span>
      <span className="typed-live" aria-hidden="true" data-type={text} />
    </span>
  );
}

/**
 * The details of one track, opened from its corner of the hero's room: what was done there and
 * with which tools. Previous and next step through the corners; close goes back to the whole room.
 */
const RoomDetail = forwardRef(function RoomDetail({ index, count, track, labels, onClose, onStep }, ref) {
  const bodyRef = useRef(null);

  // The title types out, then each point in turn; the tool chips follow.
  useLayoutEffect(() => {
    const body = bodyRef.current;
    const lines = [...body.querySelectorAll('[data-type]')];
    const chips = body.querySelectorAll('.room-detail-tools li');
    if (prefersReducedMotion()) {
      lines.forEach(el => {
        el.textContent = el.dataset.type;
      });
      return undefined;
    }
    lines.forEach(el => {
      el.textContent = '';
    });
    const timeline = gsap.timeline({ delay: 0.35 });
    lines.forEach(el => {
      const text = el.dataset.type;
      const perLetter = el.closest('.room-detail-title') ? 0.028 : 0.0085;
      const typed = { n: 0 };
      timeline.to(
        typed,
        {
          n: text.length,
          duration: Math.min(1.2, Math.max(0.3, text.length * perLetter)),
          ease: 'none',
          onStart: () => el.classList.add('is-typing'),
          onUpdate: () => {
            el.textContent = text.slice(0, Math.round(typed.n));
          },
          onComplete: () => el.classList.remove('is-typing')
        },
        '+=0.06'
      );
    });
    timeline.fromTo(chips, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' });
    return () => {
      timeline.kill();
      lines.forEach(el => el.classList.remove('is-typing'));
    };
  }, [index, track]);

  return (
    <section className={`room-detail c${index}`} ref={ref} tabIndex={-1} aria-label={labels.detailLabel}>
      {/* Keyed by track, so each corner's details slide in afresh */}
      <div className="room-detail-body" key={index} ref={bodyRef}>
        <div className="room-detail-head">
          <span className="room-detail-track">
            <span className="dot" aria-hidden="true" />
            <span>
              {track.name}
              <span className="room-detail-where"> · {track.where}</span>
            </span>
          </span>
          <button type="button" className="room-detail-close" onClick={onClose} aria-label={labels.back}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>
        <h3 className="room-detail-title">
          <Typed text={track.title} />
        </h3>
        <ul className="room-detail-points">
          {track.points.map((point, i) => (
            <li key={i}>
              <Typed text={point} />
            </li>
          ))}
        </ul>
        <ul className="room-detail-tools">
          {track.tools.map(tool => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </div>
      <div className="room-detail-nav">
        <button type="button" onClick={() => onStep(-1)}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 2.5L4 7l4.5 4.5" />
          </svg>
          {labels.prev}
        </button>
        <span className="room-detail-count">
          {index + 1} / {count}
        </span>
        <button type="button" onClick={() => onStep(1)}>
          {labels.next}
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 2.5L10 7l-4.5 4.5" />
          </svg>
        </button>
      </div>
    </section>
  );
});

export default RoomDetail;
