import { useLang } from '../lang.jsx';
import Section from './Section.jsx';
import AnimatedContent from './reactbits/AnimatedContent.jsx';

export default function Education() {
  const { t } = useLang();
  return (
    <Section id="education" title={t.education.title}>
      <AnimatedContent className="education" distance={28} duration={0.7} stagger={0.08} threshold={0.12}>
        {t.education.items.map((item, i) => (
          <div className="education-item glass" key={i}>
            <span className="chip chip-period">{item.period}</span>
            <h3>{item.name}</h3>
            <p className="org">{item.org}</p>
            {item.note && <p className="education-note">{item.note}</p>}
          </div>
        ))}
      </AnimatedContent>
    </Section>
  );
}
