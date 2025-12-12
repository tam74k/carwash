// pages/OrdersPage/OrdersPage.js
import './OrdersPage.css';
import { getTranslation } from '../../utils/i18n.js';
import { getBookings } from '../../utils/supabase.js'; // You'll need to create this function
import { getCurrentUser } from '../../utils/supabase.js';
import { renderCard } from '../../components/Card/Card.js';

export async function renderOrdersPage(container) {
    const user = await getCurrentUser();
    if (!user) {
        window.navigateTo('/login');
        return;
    }

    container.innerHTML = `
        <div class="orders-page">
            <h2 class="page-title text-center" data-i18n="myOrders">${getTranslation('myOrders')}</h2>

            <div class="order-tabs">
                <button class="tab-button active" data-order-status="open" data-i18n="openOrders">${getTranslation('openOrders')}</button>
                <button class="tab-button" data-order-status="completed" data-i18n="completedOrders">${getTranslation('completedOrders')}</button>
                <button class="tab-button" data-order-status="cancelled" data-i18n="cancelledOrders">${getTranslation('cancelledOrders')}</button>
            </div>

            <div id="orders-list" class="mt-md">
                <p class="text-center" data-i18n="loadingOrders">${getTranslation('loadingOrders') || 'Loading orders...'}</p>
            </div>
        </div>
    `;

    const ordersList = container.querySelector('#orders-list');
    const tabButtons = container.querySelectorAll('.tab-button');

    const loadOrders = async (status) => {
        ordersList.innerHTML = `<p class="text-center" data-i18n="loadingOrders">${getTranslation('loadingOrders') || 'Loading orders...'}</p>`;
        try {
            const allBookings = await getBookings(user.id); // Fetch all bookings
            let filteredBookings = [];

            // Simple client-side filtering based on status (adjust logic for your backend status)
            if (status === 'open') {
                filteredBookings = allBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
            } else if (status === 'completed') {
                filteredBookings = allBookings.filter(b => b.status === 'completed');
            } else if (status === 'cancelled') {
                filteredBookings = allBookings.filter(b => b.status === 'cancelled');
            }

            if (filteredBookings && filteredBookings.length > 0) {
                ordersList.innerHTML = '';
                filteredBookings.forEach(booking => {
                    renderCard(ordersList, `
                        <h4 class="card-title">${getTranslation('bookingId') || 'Booking ID'}: ${booking.id}</h4>
                        <p><strong>${getTranslation('selectDate')}:</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
                        <p><strong>${getTranslation('selectTime')}:</strong> ${booking.time_slot}</p>
                        <p><strong>${getTranslation('status') || 'Status'}:</strong> <span class="booking-status booking-status-${booking.status}">${booking.status}</span></p>
                        ${booking.notes ? `<p><strong>${getTranslation('notes')}:</strong> ${booking.notes}</p>` : ''}
                        <button class="app-button secondary mt-sm">View Details</button>
                    `, 'order-card');
                });
            } else {
                ordersList.innerHTML = `<p class="text-center mt-md" data-i18n="noOrdersFound">${getTranslation('noOrdersFound') || 'No orders found for this status.'}</p>`;
            }
        } catch (error) {
            console.error("Error fetching orders:", error.message);
            ordersList.innerHTML = `<p class="error-message text-center mt-md">${getTranslation('failedToLoadOrders') || 'Failed to load orders.'}</p>`;
        }
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            loadOrders(e.target.dataset.orderStatus);
        });
    });

    // Load initial orders
    loadOrders('open');
}