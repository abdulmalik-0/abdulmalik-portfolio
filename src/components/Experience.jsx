import { useEffect, useRef } from 'react';
import { useLang } from '../lang.jsx';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import Section from './Section.jsx';
import AnimatedContent from './reactbits/AnimatedContent.jsx';

export default function Experience() {
  const { t } = useLang();
  const timelineRef = useRef(null);
  const fillRef = useRef(null);

  // The rail beside the jobs fills in as the reader scrolls down the timeline.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const tween = gsap.fromTo(
      fillRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: timelineRef.current, start: 'top 65%', end: 'bottom 60%', scrub: 0.4 }
      }
    );
    return () => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  // The same five colours as the hero cables: each bullet's dot says which track it belongs to.
  const legend = (
    <ul className="legend" aria-label={t.experience.legend}>
      {t.tracks.map((track, i) => (
        <li key={i} className={`c${i}`}>
          <span className="dot" aria-hidden="true" />
          {track.name}
        </li>
      ))}
    </ul>
  );

  return (
    <Section id="experience" title={t.experience.title} aside={legend}>
      <div className="timeline" ref={timelineRef}>
        <div className="rail" aria-hidden="true">
          <span className="rail-fill" ref={fillRef} />
        </div>
        {t.experience.jobs.map((job, j) => (
          <AnimatedContent key={j} distance={36} duration={0.8} threshold={0.12}>
            <article className="job glass">
              <div className="job-head">
                <div className="job-top">
                  <h3>{job.role}</h3>
                  <span className="chip chip-period">{job.period}</span>
                </div>
                <p className="org">{job.org}</p>
              </div>
              <ul className="chips" aria-hidden="true">
                {job.chips.map(chip => (
                  <li className="chip" key={chip} dir="ltr">
                    {chip}
                  </li>
                ))}
              </ul>
              <ul className="bullets">
                {job.bullets.map(([track, text], k) => (
                  <li key={k} className={`c${track}`}>
                    <span className="dot" aria-hidden="true" />
                    <span>
                      <span className="sr-only">{t.tracks[track].name}: </span>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </AnimatedContent>
        ))}
      </div>
    </Section>
  );
}
