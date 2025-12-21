//This file is for handling the translations when users switch between site languages

const defaultLang = 'nl'; // fallback language
window.flags = {
  en: '/assets/img/translation-flags/english.png',
  nl: '/assets/img/translation-flags/belgium.png'
};

// Load translations for a given language
async function loadTranslations(lang) {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    if (!response.ok) throw new Error('Translation file not found');
    const translations = await response.json();
    applyTranslations(translations);
  } catch (err) {
    console.error(`Error loading ${lang} translations:`, err);
  }
}

// Apply translations to elements with data-i18n
function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.innerHTML = translations[key]; 
    }
  });

  // Translate attributes
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const attrMapping = el.getAttribute('data-i18n-attr');
    const [attr, key] = attrMapping.split(':');
    if (translations[key]) {
      el.setAttribute(attr, translations[key]);
    }
  });
}



function updateFlag(lang) {
  document.querySelectorAll('.nav-link.dropdown-toggle img').forEach(img => {
    img.src = window.flags[lang] || window.flags['nl'];
  });
}

// Save selected language in localStorage
function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  loadTranslations(lang);
  updateFlag(lang);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || defaultLang;
  loadTranslations(savedLang);
  updateFlag(savedLang);

  // Attach event listeners to language switcher dropdown
  document.querySelectorAll('.dropdown-menu a[data-lang]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const lang = link.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
});