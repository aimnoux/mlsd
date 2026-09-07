import './style.css';
import { cases } from './data/cases';
import type { Category, Domain, Filter } from './types';
import {
  initAnalytics,
  trackExternalLink,
  trackGoal,
  trackPageView,
  trackVisitParams,
} from './analytics';

// ── Label maps ────────────────────────────────────────────

// Record<Category, …> makes the compiler demand a label for every new value.
const CATEGORY_LABEL: Record<Category, string> = {
  classic_ml: 'Classic ML',
  recsys: 'RecSys',
  cv: 'CV',
  llm_engineer: 'LLM-engineer',
  ai_engineer: 'AI-engineer',
};

const DOMAIN_LABEL: Record<Domain, string> = {
  retail: 'Retail',
  fintech: 'FinTech',
  adtech: 'AdTech',
  travel: 'Travel',
  telecom: 'Telecom',
  realestate: 'RealEstate',
  media: 'Media',
  logistics: 'Logistics',
  gambling: 'Gambling',
  legal: 'Legal',
  enterprise: 'Enterprise',
  social: 'Social',
};

// Order of the pills follows the order of the label maps above.
const CATEGORIES: Array<Filter<Category>> = ['all', ...(Object.keys(CATEGORY_LABEL) as Category[])];
const DOMAINS: Array<Filter<Domain>> = ['all', ...(Object.keys(DOMAIN_LABEL) as Domain[])];

// Counts never depend on the active filters, so they are computed once.
function tally(values: string[]): Record<string, number> {
  const acc: Record<string, number> = {};
  values.forEach((v) => { acc[v] = (acc[v] ?? 0) + 1; });
  return acc;
}

const CATEGORY_COUNTS = tally(cases.flatMap((c) => c.categories));
const DOMAIN_COUNTS = tally(cases.map((c) => c.domain));

// Lowercasing every case on every keystroke is pointless — do it once.
const SEARCH_INDEX = new Map(
  cases.map((c) => [c.id, `${c.title} ${c.problemStatement}`.toLowerCase()]),
);

// ── SVG icons ─────────────────────────────────────────────

const ICON_BRAIN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`;
const ICON_SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const ICON_MOON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const ICON_ARROW_UPRIGHT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>`;
const ICON_SEND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
const ICON_FILE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
const ICON_LIST = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`;
const ICON_YOUTUBE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22.5 6.9a2.8 2.8 0 0 0-2-2C18.8 4.5 12 4.5 12 4.5s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2C1.1 8.6 1.1 12 1.1 12s0 3.4.4 5.1a2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2c.4-1.7.4-5.1.4-5.1s0-3.4-.4-5.1z"/><path d="M9.9 15.3l5.6-3.3-5.6-3.3z"/></svg>`;
const ICON_MSG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

// ── Authors ───────────────────────────────────────────────

type LinkKind = 'telegram' | 'youtube';

interface Author {
  name: string;
  links: Array<{ kind: LinkKind; label: string; handle: string; href: string }>;
}

const LINK_ICON: Record<LinkKind, string> = {
  telegram: ICON_SEND,
  youtube: ICON_YOUTUBE,
};

const LEAD_AUTHOR: Author = {
  name: 'Максим Огородник',
  links: [
    {
      kind: 'telegram',
      label: 'Telegram',
      handle: '@maxouniai',
      href: 'https://t.me/maxouniai',
    },
  ],
};

const COAUTHORS: Author[] = [
  {
    name: 'Григорий Чернышов',
    links: [
      {
        kind: 'telegram',
        label: 'Telegram',
        handle: '@doommot_channel',
        href: 'https://t.me/doommot_channel',
      },
    ],
  },
  {
    name: 'Рома Филонов',
    links: [
      {
        kind: 'telegram',
        label: 'Telegram',
        handle: '@Ai_bolno_ml',
        href: 'https://t.me/Ai_bolno_ml',
      },
      {
        kind: 'youtube',
        label: 'YouTube',
        handle: '@AI_bolno_ml',
        href: 'https://www.youtube.com/@AI_bolno_ml',
      },
    ],
  },
  {
    name: 'Сергей Пошляков',
    links: [
      {
        kind: 'telegram',
        label: 'Telegram',
        handle: '@loft_ds',
        href: 'https://t.me/loft_ds',
      },
    ],
  },
];

// ── Escape HTML ───────────────────────────────────────────

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── State ─────────────────────────────────────────────────

type FilterGroup = 'category' | 'domain';

interface AppState {
  category: Filter<Category>;
  domain: Filter<Domain>;
  q: string;
}

const state: AppState = { category: 'all', domain: 'all', q: '' };
let openCaseId: string | null = null;
let lastResultCount = cases.length;

// ── Analytics helpers ─────────────────────────────────────

// A case counts as read once it is scrolled to the bottom, or after this long
// in the modal — whichever happens first. Cases short enough to fit on screen
// have nothing to scroll, so they get the shorter timeout.
const CASE_READ_MS = 30_000;
const CASE_READ_SHORT_MS = 15_000;
// Opening this many different cases in one visit marks an engaged visit.
const ENGAGED_VISIT_CASES = 3;
const SEEN_CASES_KEY = 'mlsd_seen_cases';
// Momentum scrolling rarely lands exactly on the last pixel.
const SCROLL_END_SLACK = 24;

let caseReadTimer: ReturnType<typeof setTimeout> | undefined;
let caseReadSent = false;
// The element to hand focus back to when the modal closes.
let lastFocused: HTMLElement | null = null;

// sessionStorage throws in some privacy modes — analytics must never break the page.
function readSeenCases(): Set<string> {
  try {
    return new Set((sessionStorage.getItem(SEEN_CASES_KEY) ?? '').split(',').filter(Boolean));
  } catch {
    return new Set();
  }
}

function writeSeenCases(ids: Set<string>) {
  try {
    sessionStorage.setItem(SEEN_CASES_KEY, [...ids].join(','));
  } catch {
    // ignore
  }
}

function trackEngagement(caseId: string) {
  const seen = readSeenCases();
  if (seen.has(caseId)) return;
  seen.add(caseId);
  writeSeenCases(seen);
  // Strict equality keeps the goal at one hit per visit.
  if (seen.size === ENGAGED_VISIT_CASES) trackGoal('engaged_visit', { cases: seen.size });
}

function trackCaseRead(how: 'time' | 'scroll') {
  if (caseReadSent || !openCaseId) return;
  caseReadSent = true;
  const c = cases.find((x) => x.id === openCaseId);
  trackGoal('case_read', { case_id: openCaseId, case_title: c?.title ?? '', how });
}

// ── Theme ─────────────────────────────────────────────────

function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }

// Keeps the browser UI (mobile address bar) in sync with the palette.
function syncThemeColor() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) return;
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  if (bg) meta.content = bg;
}

function toggleTheme() {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncThemeColor();
  document.getElementById('theme-btn')!.innerHTML = next === 'dark'
    ? `${ICON_SUN} Светлая`
    : `${ICON_MOON} Тёмная`;
  trackGoal('theme_toggle', { theme: next });
}

// ── Badge helpers ─────────────────────────────────────────

function catBadge(cat: Category) {
  return `<span class="badge badge-${cat}">${CATEGORY_LABEL[cat]}</span>`;
}
function catBadges(cats: Category[]) {
  return cats.map(catBadge).join('');
}
function domBadge(dom: Domain) {
  return `<span class="badge badge-${dom}">${DOMAIN_LABEL[dom]}</span>`;
}

function filterLabel(group: FilterGroup, value: string) {
  if (value === 'all') return 'All';
  return group === 'category'
    ? CATEGORY_LABEL[value as Category]
    : DOMAIN_LABEL[value as Domain];
}

// «1 вопрос», «2 вопроса», «5 вопросов»
function pluralQuestions(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} вопрос`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} вопроса`;
  return `${n} вопросов`;
}

// ── Author card ───────────────────────────────────────────

function authorCard(a: Author, lead = false) {
  const links = a.links.map((l) => `
    <a
      class="author-btn author-btn-${l.kind}"
      href="${l.href}"
      target="_blank"
      rel="noopener noreferrer"
      data-track="author"
      data-track-label="${esc(`${a.name} — ${l.label}`)}"
    >${LINK_ICON[l.kind]}<span class="author-btn-label">${esc(l.label)}</span><span
      class="author-btn-handle"
    >${esc(l.handle)}</span></a>`).join('');

  return `
    <div class="author-card${lead ? ' author-card-lead' : ''}">
      <span class="author-name">${esc(a.name)}</span>
      <div class="author-links">${links}</div>
    </div>`;
}

// ── Filter pill ───────────────────────────────────────────

function filterPill(group: FilterGroup, value: string, count: number, active: boolean) {
  return `<button
    class="filter-pill${active ? ' active' : ''}"
    type="button"
    data-group="${group}"
    data-value="${value}"
    aria-pressed="${active}"
  >${esc(filterLabel(group, value))}<span class="filter-count">${count}</span></button>`;
}

// Labels and counts of the pills never change — only which one is active,
// so they are built once and afterwards only get their state synced.
function renderPills() {
  document.getElementById('cat-pills')!.innerHTML = CATEGORIES
    .filter((c) => c === 'all' || (CATEGORY_COUNTS[c] ?? 0) > 0)
    .map((c) => filterPill(
      'category', c,
      c === 'all' ? cases.length : CATEGORY_COUNTS[c],
      state.category === c,
    )).join('');

  document.getElementById('dom-pills')!.innerHTML = DOMAINS
    .filter((d) => d === 'all' || (DOMAIN_COUNTS[d] ?? 0) > 0)
    .map((d) => filterPill(
      'domain', d,
      d === 'all' ? cases.length : DOMAIN_COUNTS[d],
      state.domain === d,
    )).join('');
}

function syncPills() {
  document.querySelectorAll<HTMLElement>('.filter-pill').forEach((pill) => {
    const active = pill.dataset.group === 'category'
      ? state.category === pill.dataset.value
      : state.domain === pill.dataset.value;
    pill.classList.toggle('active', active);
    pill.setAttribute('aria-pressed', String(active));
  });
}

function closestFrom<T extends Element>(target: EventTarget | null, selector: string): T | null {
  return target instanceof Element ? target.closest<T>(selector) : null;
}

// ── Render list ───────────────────────────────────────────

function renderList() {
  const filtered = cases.filter((c) => {
    if (state.category !== 'all' && !c.categories.includes(state.category as Category)) return false;
    if (state.domain !== 'all' && c.domain !== state.domain) return false;
    if (state.q) return (SEARCH_INDEX.get(c.id) ?? '').includes(state.q.toLowerCase());
    return true;
  });

  const cards = filtered.length
    ? filtered.map((c, i) => `
        <button
          class="case-card fade-in-up"
          data-case-id="${c.id}"
          style="animation-delay: ${i * 0.04}s"
        >
          <div class="card-top">
            <div class="card-badges">
              ${catBadges(c.categories)}
              ${domBadge(c.domain)}
            </div>
            <span class="card-arrow">${ICON_ARROW_UPRIGHT}</span>
          </div>
          <h3 class="card-title">${esc(c.title)}</h3>
          ${c.clarifyingQuestions.length
            ? `<div class="card-footer">
                 <span class="card-q-count">${ICON_MSG} ${pluralQuestions(c.clarifyingQuestions.length)}</span>
               </div>`
            : ''}
        </button>`
    ).join('')
    : `<div class="empty-state">Ничего не найдено</div>`;

  lastResultCount = filtered.length;

  const listEl = document.getElementById('case-list')!;
  listEl.innerHTML = cards;

  document.getElementById('stats-bar')!.textContent =
    `Показано ${filtered.length} из ${cases.length}`;

  syncPills();
}

// ── Modal ─────────────────────────────────────────────────

type CaseOpenSource = 'card' | 'direct' | 'history';

function openModal(id: string, pushUrl = true, source: CaseOpenSource = 'card') {
  const c = cases.find((x) => x.id === id);
  if (!c) return;
  openCaseId = id;

  const questions = c.clarifyingQuestions.map((q, i) => `
    <li class="question-item">
      <span class="question-num">${i + 1}</span>
      <span>${esc(q)}</span>
    </li>`).join('');

  document.getElementById('modal-badges')!.innerHTML =
    `${catBadges(c.categories)} ${domBadge(c.domain)}`;
  document.getElementById('modal-title')!.textContent = c.title;
  document.getElementById('modal-problem')!.textContent = c.problemStatement;
  document.getElementById('modal-questions')!.innerHTML = questions;
  document.getElementById('modal-q-label')!.textContent =
    `Уточняющие вопросы (${c.clarifyingQuestions.length})`;

  // Кейсы без собранных вопросов показываем без пустой секции
  const hasQuestions = c.clarifyingQuestions.length > 0;
  document.getElementById('modal-questions-block')!.hidden = !hasQuestions;
  document.getElementById('modal-divider')!.hidden = !hasQuestions;

  if (pushUrl) {
    const params = new URLSearchParams(location.search);
    params.set('id', id);
    history.pushState({ id }, '', `${location.pathname}?${params}`);
    document.title = `${c.title} — MLSD Cases`;
    // On the initial load Metrika has already counted this URL by itself.
    trackPageView(`${location.pathname}?${params}`, c.title);
  }

  trackGoal('case_open', {
    case_id: c.id,
    case_title: c.title,
    domain: c.domain,
    categories: c.categories.join(','),
    source,
  });
  trackVisitParams({ case_open: { [c.title]: 1 } });
  trackEngagement(c.id);

  // Everything behind the modal becomes inert: no tab stops, no screen
  // reader content, so the dialog needs no focus trap of its own.
  lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const overlay = document.getElementById('modal-overlay')!;
  overlay.removeAttribute('inert');
  document.querySelector('.page-wrap')!.setAttribute('inert', '');
  overlay.classList.add('open');
  // Hiding the page scrollbar shifts the layout — compensate for its width.
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
  document.body.style.overflow = 'hidden';

  clearTimeout(caseReadTimer);
  caseReadSent = false;
  const modal = document.getElementById('modal')!;
  modal.scrollTop = 0;
  modal.focus({ preventScroll: true });
  const fitsOnScreen = modal.scrollHeight <= modal.clientHeight + SCROLL_END_SLACK;
  caseReadTimer = setTimeout(
    () => trackCaseRead('time'),
    fitsOnScreen ? CASE_READ_SHORT_MS : CASE_READ_MS,
  );
}

function closeModal(pushUrl = true) {
  clearTimeout(caseReadTimer);
  openCaseId = null;
  if (pushUrl) {
    const params = new URLSearchParams(location.search);
    params.delete('id');
    const search = params.toString() ? `?${params}` : location.pathname;
    history.pushState({}, '', search);
    document.title = 'MLSD Cases';
  }
  const overlay = document.getElementById('modal-overlay')!;
  overlay.classList.remove('open');
  overlay.setAttribute('inert', '');
  document.querySelector('.page-wrap')!.removeAttribute('inert');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  if (lastFocused?.isConnected) lastFocused.focus({ preventScroll: true });
  lastFocused = null;
}

// ── Bind events ───────────────────────────────────────────

// Delegated once on the containers: re-rendering the list or the pills does
// not need to rebind anything.
function bindListEvents() {
  document.getElementById('case-list')!.addEventListener('click', (e) => {
    const id = closestFrom<HTMLElement>(e.target, '.case-card')?.dataset.caseId;
    if (id) openModal(id);
  });

  document.querySelector('.filters')!.addEventListener('click', (e) => {
    const pill = closestFrom<HTMLElement>(e.target, '.filter-pill');
    const group = pill?.dataset.group;
    if (!pill || (group !== 'category' && group !== 'domain')) return;

    const value = pill.dataset.value ?? 'all';
    if (group === 'category') state.category = value as Filter<Category>;
    else state.domain = value as Filter<Domain>;
    renderList();
    trackGoal(group === 'category' ? 'filter_category' : 'filter_domain', {
      value,
      label: filterLabel(group, value),
    });
  });
}

function bindOutboundEvents() {
  document.addEventListener('click', (e) => {
    const link = closestFrom<HTMLAnchorElement>(e.target, 'a[href]');
    if (!link) return;

    let host: string;
    try {
      const url = new URL(link.href, location.href);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
      host = url.host;
    } catch {
      return;
    }
    if (host === location.host) return;

    const place = link.dataset.track ?? 'other';
    const label = link.dataset.trackLabel ?? link.textContent?.trim() ?? link.href;

    trackExternalLink(link.href, label);
    trackGoal('outbound_click', { place, label, url: link.href });
    trackVisitParams({ outbound: { [place]: { [label]: 1 } } });
    if (place === 'author') trackGoal('author_link', { label, url: link.href });
    if (place === 'footer') trackGoal('footer_link', { label, url: link.href });
  });
}

// ── Bootstrap ─────────────────────────────────────────────

function init() {
  initAnalytics();

  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="page-wrap">
      <main class="main">
        <div class="container">

          <div class="theme-wrap">
            <button class="theme-btn" id="theme-btn" aria-label="Переключить тему">
              ${isDark() ? `${ICON_SUN} Светлая` : `${ICON_MOON} Тёмная`}
            </button>
          </div>

          <div class="hero fade-in-up">
            <div class="hero-icon-wrap">${ICON_BRAIN}</div>
            <h1 class="hero-title">
              <span class="hero-title-line1">ML System Design</span>
              <span class="hero-title-line2">Interview Cases</span>
            </h1>
            <p class="hero-subtitle">
              Коллекция mlsd-кейсов с реальных технических собеседований на позиции Data Scientist и ML Engineer
            </p>
            <div class="authors">
              <span class="authors-title">Авторы сборника</span>
              <div class="authors-list">
                ${authorCard(LEAD_AUTHOR, true)}
                ${COAUTHORS.map((a) => authorCard(a)).join('')}
              </div>
            </div>
          </div>

          <div class="search-wrap">
            <input
              id="search-input"
              class="search-input"
              type="search"
              placeholder="Поиск по кейсам..."
              autocomplete="off"
              spellcheck="false"
            />
          </div>

          <div class="filters">
            <div class="filter-row">
              <span class="filter-label">Направление:</span>
              <div id="cat-pills" style="display:contents"></div>
            </div>
            <div class="filter-row">
              <span class="filter-label">Домен:</span>
              <div id="dom-pills" style="display:contents"></div>
            </div>
          </div>

          <p class="stats-bar" id="stats-bar"></p>

          <div class="case-grid" id="case-list"></div>

        </div>
      </main>

      <footer class="site-footer">
        <div class="container">
          <p class="footer-desc">Сборник кейсов по ML System Design с реальных собеседований</p>
          <div class="footer-contacts">
            <a
              class="footer-link"
              href="https://t.me/maxouniai"
              target="_blank"
              rel="noopener"
              data-track="footer"
              data-track-label="Футер — Telegram-канал"
            >
              ${ICON_SEND}<span>Telegram-канал</span>
            </a>
            <a
              class="footer-link"
              href="https://t.me/dgiknooor"
              target="_blank"
              rel="noopener"
              data-track="footer"
              data-track-label="Футер — Написать"
            >
              ${ICON_SEND}<span>Написать</span>
            </a>
          </div>
        </div>
      </footer>
    </div>

    <!-- Modal -->
    <div id="modal-overlay" class="modal-overlay" inert>
      <div
        class="modal"
        id="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabindex="-1"
      >
        <div class="modal-header">
          <div class="modal-header-top">
            <div class="modal-badges" id="modal-badges"></div>
            <button class="modal-close" id="modal-close" aria-label="Закрыть">✕</button>
          </div>
          <h2 class="modal-title" id="modal-title"></h2>
        </div>
        <div class="modal-body">
          <div>
            <div class="modal-section-head">
              ${ICON_FILE}
              <span>Постановка задачи</span>
            </div>
            <p class="problem-text" id="modal-problem"></p>
          </div>
          <div class="modal-divider" id="modal-divider"></div>
          <div id="modal-questions-block">
            <div class="modal-section-head">
              ${ICON_LIST}
              <span id="modal-q-label">Уточняющие вопросы</span>
            </div>
            <ul class="questions-list" id="modal-questions"></ul>
          </div>
        </div>
      </div>
    </div>
  `;

  // Theme button
  document.getElementById('theme-btn')!.addEventListener('click', toggleTheme);

  // Search
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  let debounce: ReturnType<typeof setTimeout>;
  let searchTrackDebounce: ReturnType<typeof setTimeout>;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      state.q = searchInput.value;
      renderList();
    }, 180);

    // Longer delay so a query is reported once, not on every keystroke.
    clearTimeout(searchTrackDebounce);
    searchTrackDebounce = setTimeout(() => {
      const q = searchInput.value.trim().toLowerCase();
      if (q.length < 3) return;
      trackGoal('search', { query: q, results: lastResultCount });
      trackVisitParams({ search_query: { [q]: 1 } });
      // Queries with no hits are the shortlist of cases worth adding.
      if (lastResultCount === 0) {
        trackGoal('search_empty', { query: q });
        trackVisitParams({ search_empty: { [q]: 1 } });
      }
    }, 1200);
  });

  // Reading a case to the end
  const modal = document.getElementById('modal')!;
  modal.addEventListener('scroll', () => {
    // A modal with nothing to scroll is always "at the bottom" — such cases
    // are only ever counted as read by the timer.
    if (modal.scrollHeight <= modal.clientHeight + SCROLL_END_SLACK) return;
    if (modal.scrollTop + modal.clientHeight >= modal.scrollHeight - SCROLL_END_SLACK) {
      trackCaseRead('scroll');
    }
  });

  // Modal close
  document.getElementById('modal-close')!.addEventListener('click', () => closeModal());
  document.getElementById('modal-overlay')!.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openCaseId) closeModal();
  });

  // Browser back/forward
  window.addEventListener('popstate', () => {
    const id = new URLSearchParams(location.search).get('id');
    if (id) {
      openModal(id, false, 'history');
    } else {
      closeModal(false);
    }
  });

  syncThemeColor();
  renderPills();
  bindListEvents();
  bindOutboundEvents();

  renderList();

  // Auto-open if ?id= is in the URL on initial load
  const initialId = new URLSearchParams(location.search).get('id');
  if (initialId) openModal(initialId, false, 'direct');
}

init();
