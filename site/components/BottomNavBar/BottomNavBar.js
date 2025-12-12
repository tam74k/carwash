// components/BottomNavBar/BottomNavBar.js
import './BottomNavBar.css';
import { getTranslation } from '../../utils/i18n.js';

export function renderBottomNavBar(container, navigateCb) {
    const navItems = [
        { path: '/home', icon: './assets/icons/home.svg', labelKey: 'homeNav' },
        { path: '/book', icon: './assets/icons/book.svg', labelKey: 'bookNav' },
        { path: '/orders', icon: './assets/icons/orders.svg', labelKey: 'ordersNav' },
        { path: '/settings', icon: './assets/icons/profile.svg', labelKey: 'profileNav' } // Using profile icon for settings
    ];

    const currentPath = window.location.pathname;

    const navHtml = `
        <div class="bottom-nav-bar">
            ${navItems.map(item => `
                <a href="${item.path}" class="nav-item ${currentPath === item.path ? 'active' : ''}" data-nav-link="${item.path}">
                    <img src="${item.icon}" alt="${getTranslation(item.labelKey)} Icon" class="nav-icon">
                    <span class="nav-label" data-i18n="${item.labelKey}">${getTranslation(item.labelKey)}</span>
                </a>
            `).join('')}
        </div>
    `;
    container.innerHTML = navHtml;
}