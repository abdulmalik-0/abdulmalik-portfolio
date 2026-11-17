import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { content } from './content.js';

const LangContext = createContext(null);
const STORAGE_KEY = 'portfolio-lang';

function initialLang() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    // Storage can be blocked (private windows); English is the default either way.
  }
  return 'en';
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Not saved; the choice still holds for this visit.
    }
  }, [lang]);

  const toggle = useCallback(() => setLang(current => (current === 'en' ? 'ar' : 'en')), []);
  const value = useMemo(() => ({ lang, toggle, t: content[lang] }), [lang, toggle]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
