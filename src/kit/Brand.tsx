import { SITE } from './social.ts';
import { track } from './track.ts';
import './follow.css';

export function Brand() {
  return <a className="brand" href={SITE + '?ref=lab'} aria-label="ovictorlab, voltar ao site" onClick={() => track('out', 'site')}>
    <svg width="27" height="27" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12 A38 38 0 1 0 88 50" fill="none" stroke="currentColor" strokeWidth="14"/><circle cx="50" cy="50" r="13" fill="currentColor"/></svg>
    <span>ovictorlab</span>
  </a>;
}
