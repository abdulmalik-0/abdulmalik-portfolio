import { useEffect, useRef, useState } from 'react';
import { useLang } from '../lang.jsx';
import { LINKS } from '../content.js';
import { setScrollLocked } from '../lib/motion.js';

// The CV page's size on screen: the A4 sheet (210mm) and the 20px desk around it (public/cv.html).
const SHEET_WIDTH = 834;
const SHEET_HEIGHT = 1163;

/**
 * The CV shown in a native dialog: Esc, the Close button and a click outside all close it.
 * It shows the CV's web page (public/cv.html), drawn at its real size and scaled to the dialog's
 * width, rather than the PDF: phones and some browsers cannot show a PDF inside a page and
 * download it instead. The PDF stays one click away.
 */
export default function CvDialog({ open, onClose }) {
  const { t } = useLang();
  const ref = useRef(null);
  const viewRef = useRef(null);
  const frameRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(SHEET_HEIGHT);

  // The sheet fills the dialog's width (a little larger than life on wide screens at most).
  useEffect(() => {
    if (!open) return undefined;
    const view = viewRef.current;
    const fit = () => setScale(Math.min(1.25, view.clientWidth / SHEET_WIDTH));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(view);
    return () => observer.disconnect();
  }, [open]);

  // The page's own height, in case it ever runs past one sheet
  const measure = () => {
    try {
      setHeight(frameRef.current.contentDocument.documentElement.scrollHeight || SHEET_HEIGHT);
    } catch {
      setHeight(SHEET_HEIGHT);
    }
  };

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
            <a className="text-link" href={LINKS.cvPage} target="_blank" rel="noreferrer">
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
        <div className="cv-view" ref={viewRef}>
          {open && (
            <div className="cv-sheet" style={{ width: SHEET_WIDTH * scale, height: height * scale }}>
              <iframe
                ref={frameRef}
                className="cv-frame"
                src={LINKS.cvPage}
                title={t.cv.title}
                onLoad={measure}
                style={{ width: SHEET_WIDTH, height, transform: `scale(${scale})` }}
              />
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
