import { useLang } from '../lang.jsx';
import Section from './Section.jsx';
import ScrollReveal from './reactbits/ScrollReveal.jsx';
import AnimatedContent from './reactbits/AnimatedContent.jsx';
import CountUp from './reactbits/CountUp.jsx';

// Each figure belongs to a track, so it carries that track's colour.
const STAT_TRACKS = [0, 1, 4];

export default function About() {
  const { t, lang } = useLang();
  return (
    <Section id="about" title={t.about.title} className="about">
      {/* The statement sharpens word by word as it scrolls into view. */}
      <ScrollReveal
        key={lang}
        baseOpacity={0.16}
        baseRotation={0}
        blurStrength={3}
        containerClassName="about-reveal"
        textClassName="about-text"
      >
        {t.about.text}
      </ScrollReveal>

      <AnimatedContent className="stats" distance={28} duration={0.7} stagger={0.1} threshold={0.15}>
        {t.about.stats.map((stat, i) => (
          <div className={`stat glass c${STAT_TRACKS[i]}`} key={i}>
            <CountUp to={stat.value} duration={1.6} className="stat-value" />
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </AnimatedContent>
    </Section>
  );
}
