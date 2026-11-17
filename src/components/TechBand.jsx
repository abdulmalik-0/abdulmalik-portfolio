import { useMemo } from 'react';
import { useLang } from '../lang.jsx';
import { TECH } from '../content.js';
import LogoLoop from './reactbits/LogoLoop.jsx';

/** A band of tool names that drifts past under the hero. */
export default function TechBand() {
  const { t, lang } = useLang();
  const items = useMemo(() => TECH.map(name => ({ node: <span className="tech-item">{name}</span>, title: name })), []);

  return (
    <section className="tech-band" aria-label={t.techLabel}>
      {/* The loop does its own positioning, so it stays left-to-right; only its travel flips. */}
      <div dir="ltr">
        <LogoLoop
          logos={items}
          speed={55}
          gap={52}
          logoHeight={24}
          direction={lang === 'ar' ? 'right' : 'left'}
          fadeOut
          draggable={false}
          ariaLabel={t.techLabel}
        />
      </div>
    </section>
  );
}
