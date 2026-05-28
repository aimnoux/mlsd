import './style.css';
import { cases } from './data/cases';
import type { Category, Domain, Filter } from './types';

// ── Label maps ────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  classic_ml: 'ClassicML',
  recsys: 'RecSys',
  nlp: 'NLP',
  cv: 'CV',
};

const DOMAIN_LABEL: Record<string, string> = {
  retail: 'Retail',
  fintech: 'FinTech',
  adtech: 'AdTech',
  travel: 'Travel',
  telecom: 'Telecom',
  realestate: 'RealEstate',
  media: 'Media',
  logistics: 'Logistics',
};

const CATEGORIES: Array<Filter<Category>> = ['all', 'classic_ml', 'recsys', 'nlp', 'cv'];
const DOMAINS: Array<Filter<Domain>> = [
  'all', 'retail', 'fintech', 'adtech', 'travel',
  'telecom', 'realestate', 'media', 'logistics',
];

// ── SVG icons ─────────────────────────────────────────────

const ICON_BRAIN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`;
const ICON_SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
const ICON_MOON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const ICON_ARROW_UPRIGHT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10"/></svg>`;
const ICON_SEND = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
const ICON_FILE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
const ICON_LIST = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`;
const ICON_MSG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

// ── Escape HTML ───────────────────────────────────────────

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── State ─────────────────────────────────────────────────

interface AppState {
  category: Filter<Category>;
  domain: Filter<Domain>;
  q: string;
}

let state: AppState = { category: 'all', domain: 'all', q: '' };
let openCaseId: string | null = null;

// ── Theme ─────────────────────────────────────────────────

function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }

function toggleTheme() {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.getElementById('theme-btn')!.innerHTML = next === 'dark'
    ? `${ICON_SUN} Светлая`
    : `${ICON_MOON} Тёмная`;
}

// ── Badge helpers ─────────────────────────────────────────

function catBadge(cat: string) {
  return `<span class="badge badge-${cat}">${CATEGORY_LABEL[cat] ?? cat}</span>`;
}
function domBadge(dom: string) {
  return `<span class="badge badge-${dom}">${DOMAIN_LABEL[dom] ?? dom}</span>`;
}

// ── Filter pill ───────────────────────────────────────────

function filterPill(
  label: string, value: string, count: number,
  active: boolean, group: 'category' | 'domain',
) {
  return `<button class="filter-pill${active ? ' active' : ''}" data-group="${group}" data-value="${value}">
    ${esc(label)}<span class="filter-count">${count}</span>
  </button>`;
}

// ── Render list ───────────────────────────────────────────

function renderList() {
  const catCounts: Record<string, number> = {};
  const domCounts: Record<string, number> = {};
  cases.forEach((c) => {
    catCounts[c.category] = (catCounts[c.category] ?? 0) + 1;
    domCounts[c.domain] = (domCounts[c.domain] ?? 0) + 1;
  });

  const filtered = cases.filter((c) => {
    if (state.category !== 'all' && c.category !== state.category) return false;
    if (state.domain !== 'all' && c.domain !== state.domain) return false;
    if (state.q) {
      const q = state.q.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.problemStatement.toLowerCase().includes(q);
    }
    return true;
  });

  const catPills = CATEGORIES
    .filter((c) => c === 'all' || (catCounts[c] ?? 0) > 0)
    .map((c) => filterPill(
      c === 'all' ? 'All' : (CATEGORY_LABEL[c] ?? c),
      c, c === 'all' ? cases.length : (catCounts[c] ?? 0),
      state.category === c, 'category',
    )).join('');

  const domPills = DOMAINS
    .filter((d) => d === 'all' || (domCounts[d] ?? 0) > 0)
    .map((d) => filterPill(
      d === 'all' ? 'All' : (DOMAIN_LABEL[d] ?? d),
      d, d === 'all' ? cases.length : (domCounts[d] ?? 0),
      state.domain === d, 'domain',
    )).join('');

  const cards = filtered.length
    ? filtered.map((c, i) => `
        <button
          class="case-card fade-in-up"
          data-case-id="${c.id}"
          style="animation-delay: ${i * 0.04}s"
        >
          <div class="card-top">
            <div class="card-badges">
              ${catBadge(c.category)}
              ${domBadge(c.domain)}
            </div>
            <span class="card-arrow">${ICON_ARROW_UPRIGHT}</span>
          </div>
          <h3 class="card-title">${esc(c.title)}</h3>
          <div class="card-footer">
            <span class="card-q-count">${ICON_MSG} ${c.clarifyingQuestions.length} вопросов</span>
          </div>
        </button>`
    ).join('')
    : `<div class="empty-state">Ничего не найдено</div>`;

  const listEl = document.getElementById('case-list')!;
  listEl.innerHTML = cards;

  document.getElementById('stats-bar')!.textContent =
    `Показано ${filtered.length} из ${cases.length}`;

  // pills
  document.getElementById('cat-pills')!.innerHTML = catPills;
  document.getElementById('dom-pills')!.innerHTML = domPills;

  bindCardEvents();
  bindFilterEvents();
}

// ── Modal ─────────────────────────────────────────────────

function openModal(id: string, pushUrl = true) {
  const c = cases.find((x) => x.id === id);
  if (!c) return;
  openCaseId = id;

  const questions = c.clarifyingQuestions.map((q, i) => `
    <li class="question-item">
      <span class="question-num">${i + 1}</span>
      <span>${esc(q)}</span>
    </li>`).join('');

  document.getElementById('modal-badges')!.innerHTML =
    `${catBadge(c.category)} ${domBadge(c.domain)}`;
  document.getElementById('modal-title')!.textContent = c.title;
  document.getElementById('modal-problem')!.textContent = c.problemStatement;
  document.getElementById('modal-questions')!.innerHTML = questions;
  document.getElementById('modal-q-label')!.textContent =
    `Уточняющие вопросы (${c.clarifyingQuestions.length})`;

  if (pushUrl) {
    const params = new URLSearchParams(location.search);
    params.set('id', id);
    history.pushState({ id }, '', `${location.pathname}?${params}`);
    document.title = `${c.title} — MLSD Cases`;
  }

  const overlay = document.getElementById('modal-overlay')!;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(pushUrl = true) {
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
  document.body.style.overflow = '';
}

// ── Bind events ───────────────────────────────────────────

function bindCardEvents() {
  document.querySelectorAll<HTMLElement>('.case-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.caseId;
      if (id) openModal(id);
    });
  });
}

function bindFilterEvents() {
  document.querySelectorAll<HTMLElement>('.filter-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      const group = pill.dataset.group as 'category' | 'domain';
      const value = pill.dataset.value ?? 'all';
      if (group === 'category') state.category = value as Filter<Category>;
      else state.domain = value as Filter<Domain>;
      renderList();
    });
  });
}

// ── Bootstrap ─────────────────────────────────────────────

function init() {
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
            <a
              class="author-btn"
              href="https://t.me/maxouniai"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${ICON_SEND}
              <span>Автор сборника — maxouni.ai</span>
            </a>
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
            <a class="footer-link" href="https://t.me/maxouniai" target="_blank" rel="noopener">
              ${ICON_SEND}<span>Telegram-канал</span>
            </a>
            <a class="footer-link" href="https://t.me/immaxouni" target="_blank" rel="noopener">
              ${ICON_SEND}<span>Написать</span>
            </a>
          </div>
        </div>
      </footer>
    </div>

    <!-- Modal -->
    <div id="modal-overlay" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal" id="modal">
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
          <div class="modal-divider"></div>
          <div>
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
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      state.q = searchInput.value;
      renderList();
    }, 180);
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
      openModal(id, false);
    } else {
      closeModal(false);
    }
  });

  renderList();

  // Auto-open if ?id= is in the URL on initial load
  const initialId = new URLSearchParams(location.search).get('id');
  if (initialId) openModal(initialId, false);
}

init();
