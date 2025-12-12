// pages/SettingsPage/SettingsPage.js
import './SettingsPage.css';
import { getTranslation } from '../../utils/i18n.js';
import { supabase, getCurrentUser, signOut } from '../../utils/supabase.js';
import { renderButton } from '../../components/Button/Button.js';
import { handleLanguageChange } from '../../script.js'; // Import global language handler

export async function renderSettingsPage(container) {
    const user = await getCurrentUser();
    if (!user) {
        window.navigateTo('/login');
        return;
    }

    container.innerHTML = `
        <div class="settings-page">
            <h2 class="page-title text-center" data-i18n="settingsTitle">${getTranslation('settingsTitle')}</h2>

            <div class="settings-section card">
                <h3 data-i18n="language">${getTranslation('language')}</h3>
                <div class="setting-item">
                    <label for="language-select">${getTranslation('language')}</label>
                    <select id="language-select">
                        <option value="en" data-i18n="english">${getTranslation('english')}</option>
                        <option value="ar" data-i18n="arabic">${getTranslation('arabic')}</option>
                    </select>
                </div>
            </div>

            <div class="settings-section card mt-md">
                <h3 data-i18n="profileDetails">${getTranslation('profileDetails')}</h3>
                <div class="setting-item">
                    <p><strong>${getTranslation('emailLabel')}:</strong> ${user.email}</p>
                    <!-- Add more profile details from Supabase if available -->
                </div>
                <div id="edit-profile-button-container" class="mt-md"></div>
            </div>

            <div id="logout-button-container" class="mt-xl"></div>
        </div>
    `;

    // Set initial language selection
    const languageSelect = container.querySelector('#language-select');
    languageSelect.value = localStorage.getItem('appLang') || 'en';

    languageSelect.addEventListener('change', (e) => {
        handleLanguageChange(e.target.value);
    });

    const logoutButtonContainer = container.querySelector('#logout-button-container');
    renderButton(logoutButtonContainer, getTranslation('logout'), async () => {
        try {
            await signOut();
            window.navigateTo('/login');
        } catch (error) {
            alert(error.message);
        }
    }, 'secondary full-width');

    const editProfileButtonContainer = container.querySelector('#edit-profile-button-container');
    renderButton(editProfileButtonContainer, getTranslation('editProfile') || 'Edit Profile', () => {
        // Handle navigation to an edit profile page or show a modal
        alert('Edit profile functionality not yet implemented.'); // Needs i18n
    }, 'primary'); // Or a secondary button
}