import { useLang } from '../lang.jsx';
import Section from './Section.jsx';
import AnimatedContent from './reactbits/AnimatedContent.jsx';

export default function Skills() {
  const { t } = useLang();
  return (
    <Section id="skills" title={t.skills.title}>
      {/* The groups come in one after another, in track order. */}
      <AnimatedContent className="skills" distance={28} duration={0.7} stagger={0.07} threshold={0.1}>
        {t.skills.groups.map((group, i) => (
          <div className={`skill-group glass${group.track === null ? '' : ` c${group.track}`}`} key={i}>
            <h3>
              {group.track !== null && <span className="dot" aria-hidden="true" />}
              <span>{group.name}</span>
            </h3>
            <ul className="chips">
              {group.items.map(item => (
                <li className="chip" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </AnimatedContent>
    </Section>
  );
}
