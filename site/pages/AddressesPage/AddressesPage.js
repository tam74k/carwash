// pages/AddressesPage/AddressesPage.js
import './AddressesPage.css';
import { getTranslation } from '../../utils/i18n.js';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../utils/supabase.js';
import { getCurrentUser } from '../../utils/supabase.js';
import { renderButton } from '../../components/Button/Button.js';
import { renderCard } from '../../components/Card/Card.js';

export async function renderAddressesPage(container) {
    const user = await getCurrentUser();
    if (!user) {
        window.navigateTo('/login');
        return;
    }

    container.innerHTML = `
        <div class="addresses-page">
            <h2 class="page-title text-center" data-i18n="addressesTitle">${getTranslation('addressesTitle')}</h2>

            <div id="addresses-list" class="mt-md">
                <p class="text-center" data-i18n="loadingAddresses">${getTranslation('loadingAddresses') || 'Loading addresses...'}</p>
            </div>

            <div class="card mt-xl">
                <h3 class="text-center" data-i18n="addAddress">${getTranslation('addAddress')}</h3>
                <form id="address-form" class="mt-md">
                    <input type="hidden" id="address-id">
                    <label for="address-label" data-i18n="addressLabel">${getTranslation('addressLabel') || 'Label (e.g., Home, Work)'}</label>
                    <input type="text" id="address-label" required placeholder="${getTranslation('addressLabel') || 'Home'}" data-i18n-attr="placeholder">

                    <label for="street" data-i18n="streetAddress">${getTranslation('streetAddress') || 'Street Address'}</label>
                    <input type="text" id="street" required placeholder="${getTranslation('streetAddress') || '123 Main St'}" data-i18n-attr="placeholder">

                    <label for="city" data-i18n="city">${getTranslation('city') || 'City'}</label>
                    <input type="text" id="city" required placeholder="${getTranslation('city') || 'New York'}" data-i18n-attr="placeholder">

                    <label for="zip-code" data-i18n="zipCode">${getTranslation('zipCode') || 'Zip Code'}</label>
                    <input type="text" id="zip-code" placeholder="${getTranslation('zipCode') || '10001'}" data-i18n-attr="placeholder">

                    <p id="address-form-error" class="error-message"></p>
                    <div id="address-form-buttons" class="mt-md"></div>
                </form>
            </div>
        </div>
    `;

    const addressesList = container.querySelector('#addresses-list');
    const addressForm = container.querySelector('#address-form');
    const addressIdInput = container.querySelector('#address-id');
    const addressLabelInput = container.querySelector('#address-label');
    const streetInput = container.querySelector('#street');
    const cityInput = container.querySelector('#city');
    const zipCodeInput = container.querySelector('#zip-code');
    const addressFormError = container.querySelector('#address-form-error');
    const addressFormButtons = container.querySelector('#address-form-buttons');

    const loadAddresses = async () => {
        addressesList.innerHTML = `<p class="text-center" data-i18n="loadingAddresses">${getTranslation('loadingAddresses') || 'Loading addresses...'}</p>`;
        try {
            const addresses = await getAddresses(user.id);
            if (addresses && addresses.length > 0) {
                addressesList.innerHTML = '';
                addresses.forEach(address => {
                    const addressCard = renderCard(addressesList, `
                        <h4 class="card-title">${address.label}</h4>
                        <p>${address.street}, ${address.city}, ${address.zip_code || ''}</p>
                        <div class="address-actions mt-sm">
                            <button class="app-button secondary edit-address-btn"
                                data-address-id="${address.id}"
                                data-label="${address.label}"
                                data-street="${address.street}"
                                data-city="${address.city}"
                                data-zip-code="${address.zip_code || ''}"
                                data-i18n="editAddress">${getTranslation('editAddress')}</button>
                            <button class="app-button secondary delete-address-btn" data-address-id="${address.id}" data-i18n="removeAddress">${getTranslation('removeAddress')}</button>
                        </div>
                    `, 'address-item');
                });

                // Attach event listeners for edit/delete
                addressesList.querySelectorAll('.edit-address-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        addressIdInput.value = e.target.dataset.addressId;
                        addressLabelInput.value = e.target.dataset.label;
                        streetInput.value = e.target.dataset.street;
                        cityInput.value = e.target.dataset.city;
                        zipCodeInput.value = e.target.dataset.zipCode;
                        addressFormError.textContent = '';
                        renderFormButtons('edit');
                    });
                });

                addressesList.querySelectorAll('.delete-address-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        if (confirm(getTranslation('confirmDeleteAddress') || 'Are you sure you want to delete this address?')) {
                            try {
                                await deleteAddress(e.target.dataset.addressId);
                                loadAddresses();
                            } catch (error) {
                                alert(error.message);
                            }
                        }
                    });
                });

            } else {
                addressesList.innerHTML = `<p class="text-center mt-md" data-i18n="noAddressesAdded">${getTranslation('noAddressesAdded') || 'No addresses added yet.'}</p>`;
            }
        } catch (error) {
            console.error("Error fetching addresses:", error.message);
            addressesList.innerHTML = `<p class="error-message text-center mt-md">${getTranslation('failedToLoadAddresses') || 'Failed to load addresses.'}</p>`;
        }
    };

    const renderFormButtons = (mode = 'add') => {
        addressFormButtons.innerHTML = '';
        if (mode === 'add') {
            renderButton(addressFormButtons, getTranslation('addAddress'), (e) => handleAddressSubmit(e, 'add'), 'primary full-width');
        } else {
            renderButton(addressFormButtons, getTranslation('saveChanges'), (e) => handleAddressSubmit(e, 'edit'), 'primary');
            renderButton(addressFormButtons, getTranslation('cancel'), () => resetAddressForm(), 'secondary ms-sm');
        }
    };

    const handleAddressSubmit = async (e, mode) => {
        e.preventDefault();
        addressFormError.textContent = '';

        const addressId = addressIdInput.value;
        const label = addressLabelInput.value;
        const street = streetInput.value;
        const city = cityInput.value;
        const zipCode = zipCodeInput.value;

        if (!label || !street || !city) {
            addressFormError.textContent = getTranslation('fillAllFields') || 'Please fill all required fields.';
            return;
        }

        try {
            if (mode === 'add') {
                await addAddress(user.id, label, street, city, zipCode);
                alert(getTranslation('addressAdded') || 'Address added successfully!');
            } else { // edit mode
                await updateAddress(addressId, label, street, city, zipCode);
                alert(getTranslation('addressUpdated') || 'Address updated successfully!');
            }
            resetAddressForm();
            loadAddresses();
        } catch (error) {
            addressFormError.textContent = error.message;
        }
    };

    const resetAddressForm = () => {
        addressIdInput.value = '';
        addressLabelInput.value = '';
        streetInput.value = '';
        cityInput.value = '';
        zipCodeInput.value = '';
        addressFormError.textContent = '';
        renderFormButtons('add');
    };

    loadAddresses();
    renderFormButtons('add');
}