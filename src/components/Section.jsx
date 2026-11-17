import { useLang } from '../lang.jsx';
import DecryptedText from './reactbits/DecryptedText.jsx';

/** Shared section frame: the title in a side column (it stays in view on wide screens), the content beside it. */
export default function Section({ id, title, aside, background, className = '', children }) {
  const { lang } = useLang();
  return (
    <section id={id} className={`section ${className}`.trim()}>
      {background}
      <div className="wrap section-grid">
        <div className="section-head">
          <h2>
            {/* The title decodes itself when it scrolls into view. Arabic letters join, so
                scrambling them one by one would break the word; Arabic titles stay plain. */}
            {lang === 'ar' ? title : <DecryptedText key={title} text={title} animateOn="view" sequential speed={38} useOriginalCharsOnly />}
          </h2>
          {aside}
        </div>
        <div className="section-body">{children}</div>
      </div>
    </section>
  );
}
