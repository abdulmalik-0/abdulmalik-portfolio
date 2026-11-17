import { useLang } from '../lang.jsx';
import { LINKS } from '../content.js';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <p className="footer-mark" aria-hidden="true">
        {t.name}
      </p>
      <div className="wrap footer-row">
        <span>
          © {new Date().getFullYear()} {t.name}. {t.footer.rights}
        </span>
        <span className="footer-links">
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
        </span>
      </div>
    </footer>
  );
}
