// components/Card/Card.js
import './Card.css'; // This will pull in the global card styles

export function renderCard(container, content, className = '') {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${className}`;
    cardDiv.innerHTML = content;
    container.appendChild(cardDiv);
    return cardDiv;
}