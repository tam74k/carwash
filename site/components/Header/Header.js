// components/Header/Header.js
import './Header.css';
import { getTranslation } from '../../utils/i18n.js';

export function renderHeader(container, businessInfo) {
    const headerHtml = `
        <div class="app-header">
            <div class="header-branding">
                <img src="${businessInfo.logo_url}" alt="${businessInfo.name} Logo" class="header-logo">
                <h1 class="header-title" data-i18n="appName">${getTranslation('appName')}</h1>
            </div>
            <!-- Future: Add dynamic elements like notifications or profile mini-icon here -->
        </div>
    `;
    container.innerHTML = headerHtml;
}