// pages/HomePage/HomePage.js
import './HomePage.css';
import { getTranslation } from '../../utils/i18n.js';
import { getCurrentUser, getUpcomingBookings } from '../../utils/supabase.js';
import { renderButton } from '../../components/Button/Button.js';
import { renderCard } from '../../components/Card/Card.js';

export async function renderHomePage(container) {
    const user = await getCurrentUser();
    const userName = user ? user.email.split('@')[0] : getTranslation('Guest'); // Simple name extraction, needs i18n for "Guest"

    container.innerHTML = `
        <div class="home-page">
            <h2 class="home-welcome" data-i18n="homeWelcome">
                ${getTranslation('homeWelcome', { userName: userName })}
            </h2>

            <div class="hero-section card">
                <img src="./assets/images/car-wash-hero.jpg" alt="Car wash hero image" class="hero-image">
                <div class="hero-content">
                    <p class="hero-prompt" data-i18n="homeBookingPrompt">${getTranslation('homeBookingPrompt')}</p>
                    <div id="book-now-button-container"></div>
                </div>
            </div>

            <h3 class="section-title mt-xl" data-i18n="nextBooking">${getTranslation('nextBooking')}</h3>
            <div id="upcoming-booking-section">
                <!-- Upcoming booking details or "No bookings" message -->
            </div>

            <h3 class="section-title mt-xl" data-i18n="viewOffers">${getTranslation('viewOffers')}</h3>
            <div id="offers-section">
                ${renderCard(document.createElement('div'), `
                    <h4 class="card-title">Seasonal Discount!</h4>
                    <p>Get 20% off your next premium wash. Limited time offer!</p>
                    <button class="app-button secondary mt-sm">Claim Offer</button>
                `, 'offer-card').outerHTML}
                ${renderCard(document.createElement('div'), `
                    <h4 class="card-title">Refer a Friend</h4>
                    <p>Refer a friend and get a free wash for both of you!</p>
                    <button class="app-button secondary mt-sm">Share Link</button>
                `, 'offer-card').outerHTML}
            </div>
        </div>
    `;

    const bookNowButtonContainer = container.querySelector('#book-now-button-container');
    renderButton(bookNowButtonContainer, getTranslation('bookNow'), () => window.navigateTo('/book'), 'primary');

    const upcomingBookingSection = container.querySelector('#upcoming-booking-section');
    try {
        const bookings = await getUpcomingBookings(user.id); // Assuming user.id is available
        if (bookings && bookings.length > 0) {
            const nextBooking = bookings[0]; // Display the soonest booking
            renderCard(upcomingBookingSection, `
                <p><strong>${getTranslation('selectDate')}:</strong> ${new Date(nextBooking.booking_date).toLocaleDateString()}</p>
                <p><strong>${getTranslation('selectTime')}:</strong> ${nextBooking.time_slot}</p>
                <p><strong>${getTranslation('selectLocation')}:</strong> ${nextBooking.location_name}</p>
                <p><strong>${getTranslation('selectCar')}:</strong> ${nextBooking.car_model} (${nextBooking.license_plate})</p>
                <button class="app-button secondary mt-sm">View Details</button>
            `);
        } else {
            upcomingBookingSection.innerHTML = `<p class="text-center mt-md">${getTranslation('noUpcomingBookings') || 'No upcoming bookings.'}</p>`;
        }
    } catch (error) {
        console.error("Error fetching upcoming bookings:", error.message);
        upcomingBookingSection.innerHTML = `<p class="error-message text-center mt-md">${getTranslation('failedToLoadBookings') || 'Failed to load bookings.'}</p>`;
    }
}