// utils/i18n.js
import en from '../lang/en.json';
import ar from '../lang/ar.json';

const translations = {
    en: en,
    ar: ar
};

let currentLanguage = localStorage.getItem('appLang') || 'en';

export function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('appLang', lang);
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        applyTranslations();
        return true;
    }
    console.warn(`Language '${lang}' not supported.`);
    return false;
}

export function getTranslation(key, replacements = {}) {
    let translation = translations[currentLanguage][key] || key;
    for (const placeholder in replacements) {
        translation = translation.replace(`{{${placeholder}}}`, replacements[placeholder]);
    }
    return translation;
}

export function applyTranslations(element = document) {
    const elements = element.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            // Check if there's a specific attribute to translate (e.g., placeholder, title)
            const attr = el.getAttribute('data-i18n-attr');
            if (attr) {
                el.setAttribute(attr, getTranslation(key));
            } else {
                el.innerHTML = getTranslation(key);
            }
        }
    });
}

// Initialize language on first load
setLanguage(currentLanguage);