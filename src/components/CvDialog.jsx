import { useEffect, useRef } from 'react';
import { useLang } from '../lang.jsx';
import { LINKS } from '../content.js';
import { setScrollLocked } from '../lib/motion.js';

/** The CV shown in a native dialog: Esc, the Close button and a click outside all close it. */
export default function CvDialog({ open, onClose }) {
  const { t } = useLang();
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) {
      dialog.showModal();
      setScrollLocked(true);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="cv-dialog"
      aria-labelledby="cv-title"
      data-lenis-prevent
      onClose={() => {
        setScrollLocked(false);
        onClose();
      }}
      onClick={event => {
        // The dialog element itself is only hit when the click lands on the backdrop.
        if (event.target === ref.current) ref.current.close();
      }}
    >
      <div className="cv-box">
        <div className="cv-bar">
          <h2 id="cv-title">{t.cv.title}</h2>
          <div className="cv-actions">
            <a className="text-link" href={LINKS.cv} target="_blank" rel="noreferrer">
              {t.cv.openTab}
            </a>
            <a className="btn btn-line btn-small" href={LINKS.cv} download>
              {t.cv.download}
            </a>
            <button type="button" className="btn btn-solid btn-small" onClick={() => ref.current.close()}>
              {t.cv.close}
            </button>
          </div>
        </div>
        {open && <iframe className="cv-frame" src={LINKS.cv} title={t.cv.title} />}
      </div>
    </dialog>
  );
}
