import { useState } from 'react';
import { useLang } from '../lang.jsx';
import { LINKS } from '../content.js';
import Section from './Section.jsx';
import AnimatedContent from './reactbits/AnimatedContent.jsx';
import DotGrid from './reactbits/DotGrid.jsx';

export default function Contact() {
  const { t } = useLang();
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  async function send(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');
    try {
      const response = await fetch(LINKS.formAction, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error(`Form service answered ${response.status}`);
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  // A perforated rack door behind the whole section; the dots react to the pointer.
  const dots = (
    <div className="contact-dots" aria-hidden="true">
      <DotGrid dotSize={3} gap={22} baseColor="#161F3D" activeColor="#9DB4FF" proximity={130} fade={0.5} clickShock={false} />
    </div>
  );

  return (
    <Section id="contact" title={t.contact.title} className="contact" background={dots}>
      <AnimatedContent className="contact-panel glass" distance={28} duration={0.7} threshold={0.12}>
        <div className="contact-info">
          <p>{t.contact.text}</p>
          <ul className="contact-list">
            <li>
              <a className="text-link" href={`mailto:${LINKS.email}`}>
                {LINKS.email}
              </a>
            </li>
            <li>
              <a className="text-link" href={LINKS.phoneHref} dir="ltr">
                {LINKS.phone}
              </a>
            </li>
            <li className="muted">{t.contact.location}</li>
          </ul>
          <div className="contact-social">
            <a className="text-link" href={LINKS.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="text-link" href={LINKS.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <form className="contact-form" action={LINKS.formAction} method="POST" onSubmit={send}>
          <div className="field">
            <label htmlFor="contact-name">{t.contact.nameLabel}</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="contact-email">{t.contact.emailLabel}</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" dir="ltr" required />
          </div>
          <div className="field">
            <label htmlFor="contact-message">{t.contact.messageLabel}</label>
            <textarea id="contact-message" name="message" rows="5" required />
          </div>
          <button className="btn btn-solid" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? t.contact.sending : t.contact.send}
          </button>
          <p className={`form-status is-${status}`} role="status" aria-live="polite">
            {status === 'success' ? t.contact.success : status === 'error' ? t.contact.error : ''}
          </p>
        </form>
      </AnimatedContent>
    </Section>
  );
}
