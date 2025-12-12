// components/Button/Button.js
import './Button.css';

export function renderButton(container, text, onClick, className = '', type = 'button') {
    const button = document.createElement('button');
    button.className = `app-button ${className}`;
    button.textContent = text;
    button.type = type;
    button.addEventListener('click', onClick);
    container.appendChild(button);
    return button;
}