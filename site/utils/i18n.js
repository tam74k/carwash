/**
 * i18n - Internationalization System
 * Supports Arabic and English with automatic RTL/LTR switching
 */

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'en';
    this.translations = {};
    this.readyPromise = this.init();
  }

  async init() {
    await this.loadTranslations(this.currentLang);
    this.updateDirection();

    // Auto-update page text when DOM is ready
    const updateWhenReady = () => {
      this.updatePageText();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateWhenReady);
    } else {
      // DOM already loaded, update immediately
      setTimeout(updateWhenReady, 0);
    }

    return true;
  }

  async loadTranslations(lang) {
    try {
      // Determine correct path based on current location
      let basePath = '';
      const currentPath = window.location.pathname;

      // If we're in a /pages subdirectory, go up one level
      if (currentPath.includes('/pages/')) {
        basePath = '../';
      }

      const path = `${basePath}lang/${lang}.json`;
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.status}`);
      }

      this.translations = await response.json();
      this.currentLang = lang;
      localStorage.setItem('lang', lang);
      this.updateDirection();

      console.log('✅ Translations loaded:', lang, 'Keys:', Object.keys(this.translations));
    } catch (error) {
      console.error('❌ Failed to load translations:', error);
      console.error('Current path:', window.location.pathname);

      // Set fallback empty translations
      this.translations = {
        app: { name: 'Car Wash', welcome: 'Welcome' },
        nav: { home: 'Home', book: 'Book', orders: 'Orders', profile: 'Profile' },
        common: { loading: 'Loading...', error: 'Error' }
      };
    }
  }

  updateDirection() {
    const html = document.documentElement;
    html.setAttribute('lang', this.currentLang);
    html.setAttribute('dir', this.currentLang === 'ar' ? 'rtl' : 'ltr');
  }

  updatePageText() {
    console.log('🔄 Updating page text with translations...');

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.placeholder !== translation) {
          element.placeholder = translation;
        }
      } else {
        if (element.textContent !== translation) {
          element.textContent = translation;
        }
      }
    });

    // Update all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });

    // Update all elements with data-i18n-title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });

    console.log('✅ Page text updated');
  }

  t(key) {
    if (!key) return '';

    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`⚠️ Translation key not found: ${key}`);
        return key; // Return the key itself as fallback
      }
    }

    return value;
  }

  async setLanguage(lang) {
    if (lang !== this.currentLang) {
      await this.loadTranslations(lang);
      this.updatePageText();
      // Trigger custom event for components to react to language change
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  }

  getCurrentLanguage() {
    return this.currentLang;
  }

  isRTL() {
    return this.currentLang === 'ar';
  }

  // Helper method for pages to wait until i18n is ready
  async ready() {
    await this.readyPromise;
    return true;
  }
}

// Create global i18n instance
const i18n = new I18n();

// Make it globally accessible
window.i18n = i18n;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = i18n;
}
