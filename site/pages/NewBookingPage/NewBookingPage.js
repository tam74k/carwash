// pages/NewBookingPage/NewBookingPage.js
import './NewBookingPage.css';
import { getTranslation } from '../../utils/i18n.js';
import { renderButton } from '../../components/Button/Button.js';
import { renderCard } from '../../components/Card/Card.js';
import { getCars, addBooking } from '../../utils/supabase.js';
import { getCurrentUser } from '../../utils/supabase.js';

export async function renderNewBookingPage(container) {
    const user = await getCurrentUser();
    if (!user) {
        window.navigateTo('/login'); // Redirect if not logged in
        return;
    }

    container.innerHTML = `
        <div class="new-booking-page">
            <h2 class="page-title text-center" data-i18n="newBookingTitle">${getTranslation('newBookingTitle')}</h2>

            <form id="new-booking-form" class="card">
                <label for="booking-date" data-i18n="selectDate">${getTranslation('selectDate')}</label>
                <input type="date" id="booking-date" required>

                <label for="time-slot" data-i18n="selectTime">${getTranslation('selectTime')}</label>
                <select id="time-slot" required>
                    <option value="" disabled selected data-i18n="selectTimePlaceholder">${getTranslation('selectTimePlaceholder') || 'Choose a time'}</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                </select>

                <label for="location" data-i18n="selectLocation">${getTranslation('selectLocation')}</label>
                <input type="text" id="location" required placeholder="${getTranslation('selectLocation')}" data-i18n-attr="placeholder">
                <!-- In a real app, this would be a map integration or a dropdown of saved addresses -->

                <label for="car-select" data-i18n="selectCar">${getTranslation('selectCar')}</label>
                <select id="car-select" required>
                    <option value="" disabled selected data-i18n="selectCarPlaceholder">${getTranslation('selectCarPlaceholder') || 'Choose your car'}</option>
                    <!-- Cars will be loaded dynamically -->
                </select>
                <a href="#" data-nav-link="/cars" class="text-center mt-sm d-block" data-i18n="addOrManageCars">${getTranslation('addOrManageCars') || 'Add or Manage Cars'}</a>


                <label for="notes" class="mt-md" data-i18n="addNotes">${getTranslation('addNotes')}</label>
                <textarea id="notes" rows="3" placeholder="${getTranslation('addNotes')}" data-i18n-attr="placeholder"></textarea>

                <p id="booking-error" class="error-message"></p>
                <div id="confirm-booking-button-container" class="mt-lg"></div>
            </form>
        </div>
    `;

    const carSelect = container.querySelector('#car-select');
    try {
        const cars = await getCars(user.id);
        if (cars && cars.length > 0) {
            cars.forEach(car => {
                const option = document.createElement('option');
                option.value = car.id;
                option.textContent = `${car.brand_model} (${car.license_plate})`;
                carSelect.appendChild(option);
            });
        } else {
            carSelect.innerHTML = `<option value="" disabled selected>${getTranslation('noCarsAdded') || 'No cars added. Please add one.'}</option>`;
            carSelect.disabled = true;
        }
    } catch (error) {
        console.error("Error loading cars:", error.message);
        carSelect.innerHTML = `<option value="" disabled selected>${getTranslation('failedToLoadCars') || 'Failed to load cars.'}</option>`;
        carSelect.disabled = true;
    }

    const confirmBookingButtonContainer = container.querySelector('#confirm-booking-button-container');
    const bookingError = container.querySelector('#booking-error');

    renderButton(confirmBookingButtonContainer, getTranslation('confirmBooking'), async (e) => {
        e.preventDefault();
        bookingError.textContent = '';

        const bookingDate = container.querySelector('#booking-date').value;
        const timeSlot = container.querySelector('#time-slot').value;
        const location = container.querySelector('#location').value;
        const selectedCarId = carSelect.value;
        const notes = container.querySelector('#notes').value;

        if (!bookingDate || !timeSlot || !location || !selectedCarId) {
            bookingError.textContent = getTranslation('fillAllFields') || 'Please fill all required fields.';
            return;
        }

        try {
            await addBooking(user.id, selectedCarId, bookingDate, timeSlot, location, notes); // Assuming addBooking exists in supabase.js
            alert(getTranslation('bookingSuccess') || 'Booking confirmed successfully!');
            window.navigateTo('/orders');
        } catch (error) {
            bookingError.textContent = error.message;
        }
    }, 'primary full-width');
}