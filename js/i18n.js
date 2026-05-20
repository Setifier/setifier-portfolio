import en from '../locales/en.js';
import fr from '../locales/fr.js';

// ---------------------
// Config
// ---------------------

const SUPPORTED_LANGS = ['en', 'fr'];
const STORAGE_KEY = 'portfolio-lang';
const translations = { en, fr };

let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

// ---------------------
// Core API
// ---------------------

/**
 * Translate a dot-notation key.
 * Returns the value at that key in the current locale,
 * falling back to English, then the raw key if not found.
 * @param {string} key  e.g. 'modal.visitProject'
 * @returns {*}  string, array, or any stored value
 */
export function t(key) {
  const dict = translations[currentLang] ?? translations.en;
  const value = key.split('.').reduce((obj, k) => obj?.[k], dict);
  if (value !== undefined) return value;

  // Fallback to English
  const fallback = key.split('.').reduce((obj, k) => obj?.[k], translations.en);
  return fallback ?? key;
}

/**
 * Get a localized field from a project object.
 * Looks for `field_<lang>` first, then falls back to `field` (English).
 * @param {object} project  e.g. { description: '...', description_fr: '...' }
 * @param {string} field    e.g. 'description' | 'fullDescription'
 * @returns {string}
 */
export function tProject(project, field) {
  if (!project) return '';
  const localised = project[`${field}_${currentLang}`];
  return localised ?? project[field] ?? '';
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return;
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  applyTranslations();
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

// ---------------------
// DOM updater
// ---------------------

export function applyTranslations() {
  // Plain text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  // HTML content (for the About Me paragraph with <br>)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  // Keep lang button active state in sync
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

// ---------------------
// Initializer
// ---------------------

export function initI18n() {
  document.documentElement.lang = currentLang;
  applyTranslations();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}
