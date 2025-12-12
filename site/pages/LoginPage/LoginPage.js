// pages/LoginPage/LoginPage.js
import './LoginPage.css';
import { getTranslation } from '../../utils/i18n.js';
import { signIn, signUp } from '../../utils/supabase.js';
import { renderButton } from '../../components/Button/Button.js';

export async function renderLoginPage(container, params = {}) {
    const isRegister = params.mode === 'register';

    container.innerHTML = `
        <div class="login-page">
            <h2 class="page-title text-center" data-i18n="${isRegister ? 'registerTitle' : 'loginTitle'}">
                ${getTranslation(isRegister ? 'registerTitle' : 'loginTitle')}
            </h2>
            <form id="auth-form" class="auth-form card">
                <label for="email" data-i18n="emailLabel">${getTranslation('emailLabel')}</label>
                <input type="email" id="email" required placeholder="${getTranslation('emailLabel')}" data-i18n-attr="placeholder">

                <label for="password" data-i18n="passwordLabel">${getTranslation('passwordLabel')}</label>
                <input type="password" id="password" required placeholder="${getTranslation('passwordLabel')}" data-i18n-attr="placeholder">

                ${isRegister ? `
                    <label for="confirm-password" data-i18n="confirmPasswordLabel">${getTranslation('confirmPasswordLabel')}</label>
                    <input type="password" id="confirm-password" required placeholder="${getTranslation('confirmPasswordLabel')}" data-i18n-attr="placeholder">
                ` : ''}

                <p id="auth-error" class="error-message"></p>

                <div id="auth-button-container" class="mt-md"></div>

                ${!isRegister ? `
                    <a href="#" class="forgot-password text-center mt-sm" data-i18n="forgotPassword">
                        ${getTranslation('forgotPassword')}
                    </a>
                ` : ''}
                <p class="text-center mt-md" data-i18n="noAccount">
                    ${getTranslation('noAccount')}
                    <a href="#" data-nav-link="${isRegister ? '/login' : '/register'}">
                        ${getTranslation(isRegister ? 'loginButton' : 'registerButton')}
                    </a>
                </p>
            </form>
        </div>
    `;

    const authForm = container.querySelector('#auth-form');
    const emailInput = container.querySelector('#email');
    const passwordInput = container.querySelector('#password');
    const confirmPasswordInput = container.querySelector('#confirm-password');
    const errorMessage = container.querySelector('#auth-error');
    const authButtonContainer = container.querySelector('#auth-button-container');

    renderButton(authButtonContainer, getTranslation(isRegister ? 'registerButton' : 'loginButton'), async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        const email = emailInput.value;
        const password = passwordInput.value;

        if (isRegister && password !== (confirmPasswordInput ? confirmPasswordInput.value : '')) {
            errorMessage.textContent = 'Passwords do not match.'; // Needs i18n
            return;
        }

        try {
            if (isRegister) {
                await signUp(email, password);
                alert('Registration successful! Please check your email to confirm.'); // Needs i18n
                window.navigateTo('/login');
            } else {
                await signIn(email, password);
                window.navigateTo('/home');
            }
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    }, 'primary full-width');
}