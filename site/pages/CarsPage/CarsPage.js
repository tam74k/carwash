// pages/CarsPage/CarsPage.js
import './CarsPage.css';
import { getTranslation } from '../../utils/i18n.js';
import { getCars, addCar, updateCar, deleteCar } from '../../utils/supabase.js';
import { getCurrentUser } from '../../utils/supabase.js';
import { renderButton } from '../../components/Button/Button.js';
import { renderCard } from '../../components/Card/Card.js';

export async function renderCarsPage(container) {
    const user = await getCurrentUser();
    if (!user) {
        window.navigateTo('/login');
        return;
    }

    container.innerHTML = `
        <div class="cars-page">
            <h2 class="page-title text-center" data-i18n="carsTitle">${getTranslation('carsTitle')}</h2>

            <div id="cars-list" class="mt-md">
                <p class="text-center" data-i18n="loadingCars">${getTranslation('loadingCars') || 'Loading cars...'}</p>
            </div>

            <div class="card mt-xl">
                <h3 class="text-center" data-i18n="addCar">${getTranslation('addCar')}</h3>
                <form id="car-form" class="mt-md">
                    <input type="hidden" id="car-id">
                    <label for="brand-model" data-i18n="brandModel">${getTranslation('brandModel')}</label>
                    <input type="text" id="brand-model" required placeholder="${getTranslation('brandModel')}" data-i18n-attr="placeholder">

                    <label for="license-plate" data-i18n="licensePlate">${getTranslation('licensePlate')}</label>
                    <input type="text" id="license-plate" required placeholder="${getTranslation('licensePlate')}" data-i18n-attr="placeholder">

                    <p id="car-form-error" class="error-message"></p>
                    <div id="car-form-buttons" class="mt-md"></div>
                </form>
            </div>
        </div>
    `;

    const carsList = container.querySelector('#cars-list');
    const carForm = container.querySelector('#car-form');
    const carIdInput = container.querySelector('#car-id');
    const brandModelInput = container.querySelector('#brand-model');
    const licensePlateInput = container.querySelector('#license-plate');
    const carFormError = container.querySelector('#car-form-error');
    const carFormButtons = container.querySelector('#car-form-buttons');

    const loadCars = async () => {
        carsList.innerHTML = `<p class="text-center" data-i18n="loadingCars">${getTranslation('loadingCars') || 'Loading cars...'}</p>`;
        try {
            const cars = await getCars(user.id);
            if (cars && cars.length > 0) {
                carsList.innerHTML = '';
                cars.forEach(car => {
                    const carCard = renderCard(carsList, `
                        <h4 class="card-title">${car.brand_model}</h4>
                        <p><strong>${getTranslation('licensePlate')}:</strong> ${car.license_plate}</p>
                        <div class="car-actions mt-sm">
                            <button class="app-button secondary edit-car-btn" data-car-id="${car.id}" data-brand-model="${car.brand_model}" data-license-plate="${car.license_plate}" data-i18n="editCar">${getTranslation('editCar')}</button>
                            <button class="app-button secondary delete-car-btn" data-car-id="${car.id}" data-i18n="removeCar">${getTranslation('removeCar')}</button>
                        </div>
                    `, 'car-item');
                });

                // Attach event listeners for edit/delete
                carsList.querySelectorAll('.edit-car-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        carIdInput.value = e.target.dataset.carId;
                        brandModelInput.value = e.target.dataset.brandModel;
                        licensePlateInput.value = e.target.dataset.licensePlate;
                        carFormError.textContent = '';
                        renderFormButtons('edit');
                    });
                });

                carsList.querySelectorAll('.delete-car-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        if (confirm(getTranslation('confirmDeleteCar') || 'Are you sure you want to delete this car?')) {
                            try {
                                await deleteCar(e.target.dataset.carId);
                                loadCars();
                            } catch (error) {
                                alert(error.message);
                            }
                        }
                    });
                });

            } else {
                carsList.innerHTML = `<p class="text-center mt-md" data-i18n="noCarsAdded">${getTranslation('noCarsAdded') || 'No cars added yet.'}</p>`;
            }
        } catch (error) {
            console.error("Error fetching cars:", error.message);
            carsList.innerHTML = `<p class="error-message text-center mt-md">${getTranslation('failedToLoadCars') || 'Failed to load cars.'}</p>`;
        }
    };

    const renderFormButtons = (mode = 'add') => {
        carFormButtons.innerHTML = '';
        if (mode === 'add') {
            renderButton(carFormButtons, getTranslation('addCar'), (e) => handleCarSubmit(e, 'add'), 'primary full-width');
        } else {
            renderButton(carFormButtons, getTranslation('saveChanges'), (e) => handleCarSubmit(e, 'edit'), 'primary');
            renderButton(carFormButtons, getTranslation('cancel'), () => resetCarForm(), 'secondary ms-sm'); // ms-sm needs RTL support
        }
    };

    const handleCarSubmit = async (e, mode) => {
        e.preventDefault();
        carFormError.textContent = '';

        const carId = carIdInput.value;
        const brandModel = brandModelInput.value;
        const licensePlate = licensePlateInput.value;

        if (!brandModel || !licensePlate) {
            carFormError.textContent = getTranslation('fillAllFields') || 'Please fill all fields.';
            return;
        }

        try {
            if (mode === 'add') {
                await addCar(user.id, brandModel, licensePlate);
                alert(getTranslation('carAdded') || 'Car added successfully!');
            } else { // edit mode
                await updateCar(carId, brandModel, licensePlate);
                alert(getTranslation('carUpdated') || 'Car updated successfully!');
            }
            resetCarForm();
            loadCars();
        } catch (error) {
            carFormError.textContent = error.message;
        }
    };

    const resetCarForm = () => {
        carIdInput.value = '';
        brandModelInput.value = '';
        licensePlateInput.value = '';
        carFormError.textContent = '';
        renderFormButtons('add');
    };

    loadCars();
    renderFormButtons('add');
}