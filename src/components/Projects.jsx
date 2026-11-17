import { useLang } from '../lang.jsx';
import { TRACK_COLORS } from '../tracks.js';
import Section from './Section.jsx';
import AnimatedContent from './reactbits/AnimatedContent.jsx';
import SpotlightCard from './reactbits/SpotlightCard.jsx';
import GlareHover from './reactbits/GlareHover.jsx';

const CARD_STYLE = {
  '--spotlight-card-surface': 'rgba(12, 18, 36, 0.72)',
  '--spotlight-card-border': 'rgba(255, 255, 255, 0.1)',
  '--spotlight-card-shadow': '0 40px 80px -50px rgba(0, 0, 0, 0.9)'
};

export default function Projects() {
  const { t } = useLang();
  return (
    <Section id="projects" title={t.projects.title}>
      <div className="projects">
        {t.projects.items.map((project, i) => (
          <AnimatedContent key={project.id} distance={40} duration={0.8} threshold={0.12} delay={(i % 2) * 0.1}>
            {/* The spotlight follows the pointer in the colour of the project's track. */}
            <SpotlightCard
              className={`project c${project.track}`}
              spotlightColor={TRACK_COLORS[project.track]}
              intensity={0.2}
              spotlightSize={320}
              style={CARD_STYLE}
            >
              <div className="project-media">
                {/* A streak of light crosses the artwork on hover. */}
                <GlareHover width="100%" height="100%" borderRadius="0px" glareOpacity={0.24} glareSize={38} className="project-glare">
                  <img className="project-banner" src={project.banner} alt={project.alt} width="640" height="640" loading="lazy" />
                </GlareHover>
                {project.logo && <img className="project-logo" src={project.logo} alt="" width="48" height="48" loading="lazy" />}
              </div>
              <div className="project-body">
                <h3>
                  <span className="dot" aria-hidden="true" />
                  {project.name}
                </h3>
                <p className="project-text">{project.text}</p>
                <ul className="chips">
                  {project.stack.map(item => (
                    <li className="chip" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
                {project.url && (
                  <a className="project-link" href={project.url} target="_blank" rel="noreferrer">
                    <span dir="ltr">{project.host}</span>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                    <span className="sr-only"> ({t.projects.newTab})</span>
                  </a>
                )}
              </div>
            </SpotlightCard>
          </AnimatedContent>
        ))}
      </div>
    </Section>
  );
}
