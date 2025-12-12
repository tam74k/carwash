// script.js
import { applyTranslations, setLanguage, getTranslation } from './utils/i18n.js';
import { supabase, getCurrentUser, getBusinessInfo } from './utils/supabase.js';

// Import all page and component modules
import { renderHeader } from './components/Header/Header.js';
import { renderBottomNavBar } from './components/BottomNavBar/BottomNavBar.js';

import { renderLoginPage } from './pages/LoginPage/LoginPage.js';
import { renderHomePage } from './pages/HomePage/HomePage.js';
import { renderNewBookingPage } from './pages/NewBookingPage/NewBookingPage.js';
import { renderOrdersPage } from './pages/OrdersPage/OrdersPage.js';
import { renderCarsPage } from './pages/CarsPage/CarsPage.js';
import { renderAddressesPage } from './pages/AddressesPage/AddressesPage.js';
import { renderSettingsPage } from './pages/SettingsPage/SettingsPage.js';

const appContent = document.getElementById('app-content');
const appHeader = document.getElementById('app-header');
const appNavBar = document.getElementById('app-nav-bar');

let currentPageComponent = null;

// Simple SPA Router
const routes = {
    '/login': renderLoginPage,
    '/register': (container) => renderLoginPage(container, { mode: 'register' }), // Pass mode for register form
    '/home': renderHomePage,
    '/book': renderNewBookingPage,
    '/orders': renderOrdersPage,
    '/cars': renderCarsPage,
    '/addresses': renderAddressesPage,
    '/settings': renderSettingsPage
};

async function navigateTo(path, params = {}) {
    // Page transition animation
    if (currentPageComponent) {
        appContent.classList.add('page-exit-active');
        await new Promise(resolve => setTimeout(resolve, 300)); // Match CSS transition duration
    }

    const renderFunction = routes[path];
    if (renderFunction) {
        appContent.innerHTML = ''; // Clear previous content
        currentPageComponent = renderFunction; // Keep track of current page
        await currentPageComponent(appContent, params); // Pass appContent div and any params

        applyTranslations(appContent); // Apply translations to the new content

        // Re-apply page enter animation
        appContent.classList.remove('page-exit-active');
        appContent.classList.add('page-enter-active');
        setTimeout(() => appContent.classList.remove('page-enter-active'), 300); // Remove after transition
    } else {
        console.error('404 Not Found:', path);
        // Optionally navigate to a 404 page or home
        navigateTo('/home');
    }
}

// Handle browser history navigation (back/forward)
window.addEventListener('popstate', () => {
    navigateTo(window.location.pathname);
});

// Function to handle language change from settings
export function handleLanguageChange(lang) {
    if (setLanguage(lang)) {
        // Re-render current page to apply translations and RTL/LTR
        navigateTo(window.location.pathname);
    }
}

// Initial app setup
async function initApp() {
    applyTranslations(); // Apply initial translations to static elements like title

    // Load business info for header
    let businessInfo = { name: getTranslation('appName'), logo_url: './images/logo.png' };
    try {
        const data = await getBusinessInfo();
        if (data) {
            businessInfo = data;
        }
    } catch (error) {
        console.error("Error fetching business info:", error.message);
    }
    renderHeader(appHeader, businessInfo);

    // Check auth status
    const user = await getCurrentUser();

    if (user) {
        renderBottomNavBar(appNavBar, navigateTo);
        navigateTo('/home');
    } else {
        appNavBar.innerHTML = ''; // Hide nav bar for login/register
        navigateTo('/login');
    }

    // Set up global navigation listeners for internal links
    document.body.addEventListener('click', e => {
        const { target } = e;
        // Check if the clicked element or its parent has a data-nav-link
        const navLinkElement = target.closest('[data-nav-link]');
        if (navLinkElement) {
            e.preventDefault();
            const path = navLinkElement.getAttribute('data-nav-link');
            navigateTo(path);
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);

// Expose navigateTo globally for components to use
window.navigateTo = navigateTo;
window.handleLanguageChange = handleLanguageChange; // Expose for settings page