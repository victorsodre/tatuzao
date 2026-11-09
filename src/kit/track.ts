// Medição sem cookie e sem identificador de pessoa: só o lab, o evento, a origem
// (?ref= ou domínio de quem mandou) e se a tela é de celular.
const ENDPOINT = 'https://ovictorlab-labs.victorsodre.workers.dev/e';
let slug = '';
let ref: string | null = null;
const sent = new Set<string>();

function device() {
  return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches ? 'mobile' : 'desktop';
}

function origin(): string | null {
  const params = new URLSearchParams(location.search);
  const explicit = params.get('ref') ?? params.get('utm_source');
  if (explicit) return explicit.slice(0, 60);
  if (!document.referrer) return null;
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '');
    if (host === location.hostname) {
      const path = new URL(document.referrer).pathname.split('/').filter(Boolean)[0];
      return path ? 'lab:' + path : null;
    }
    return host;
  } catch { return null; }
}

export function track(event: string, detail?: string) {
  if (!slug || typeof navigator === 'undefined') return;
  const body = JSON.stringify({ s: slug, e: event, r: ref, x: detail, d: device() });
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: 'text/plain' }))) return;
    void fetch(ENDPOINT, { method: 'POST', body, keepalive: true, mode: 'cors', headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
  } catch { /* medição nunca quebra a experiência */ }
}

/** Conta uma vez por carregamento (ex.: primeira interação com a cena). */
export function trackOnce(event: string, detail?: string) {
  const key = event + '|' + (detail ?? '');
  if (sent.has(key)) return;
  sent.add(key);
  track(event, detail);
}

export function initTracking(current: string) {
  if (slug) return;
  slug = current;
  ref = origin();
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || navigator.webdriver) { slug = ''; return; }
  track('view');
  // Interação real com a cena (o canvas 3D), contada uma vez.
  const first = (event: Event) => {
    if ((event.target as Element | null)?.closest?.('canvas')) { trackOnce('interact'); window.removeEventListener('pointerdown', first, true); }
  };
  window.addEventListener('pointerdown', first, true);
}
