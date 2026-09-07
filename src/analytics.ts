// Yandex.Metrika integration.
//
// Put the counter number from https://metrika.yandex.ru here. While it is 0
// analytics stays completely off: no script is loaded and no calls are made.
const COUNTER_ID: number = 0;

type YmFn = {
  (counterId: number, method: string, ...args: unknown[]): void;
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    ym?: YmFn;
  }
}

// Localhost visits must not pollute production stats.
function isEnabled() {
  if (!COUNTER_ID) return false;
  const host = location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1' && host !== '';
}

// Metrika's own snippet: queue calls until tag.js replaces the stub.
function ensureStub(): YmFn {
  if (!window.ym) {
    const stub = function (...args: unknown[]) {
      (stub.a = stub.a ?? []).push(args);
    } as YmFn;
    stub.l = Date.now();
    window.ym = stub;
  }
  return window.ym;
}

function call(method: string, ...args: unknown[]) {
  if (!isEnabled()) return;
  ensureStub()(COUNTER_ID, method, ...args);
}

export function initAnalytics() {
  if (!isEnabled()) return;
  ensureStub();

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.head.appendChild(script);

  call('init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

// Virtual page view — the SPA changes the URL without a reload.
export function trackPageView(url: string, title: string) {
  call('hit', url, { title });
}

// Goal hits show up in Metrika only after a goal with the same identifier is
// created in its UI (type «JavaScript-событие»).
export function trackGoal(goal: string, params?: Record<string, unknown>) {
  call('reachGoal', goal, params);
}

// Outbound clicks land in the built-in «Внешние переходы» report, no setup needed.
export function trackExternalLink(url: string, title: string) {
  call('extLink', url, { title });
}

// Visit params are visible in the «Параметры визитов» report without any setup.
export function trackVisitParams(params: Record<string, unknown>) {
  call('params', params);
}
