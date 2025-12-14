/**
 * Supabase Utilities
 * Centralized Supabase integration for all database operations
 * 
 * IMPORTANT: Replace 'YOUR_SUPABASE_URL' and 'YOUR_SUPABASE_ANON_KEY'
 * with your actual Supabase project credentials
 */

// Initialize Supabase client
const SUPABASE_URL = 'https://hvkxrriietvziwqmjyqi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2a3hycmlpZXR2eml3cW1qeXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNDc3NjUsImV4cCI6MjA4MDcyMzc2NX0.RHCQnRmCoCOhvs4yhwT3kGef9Z-mRWEDCmCq03WiRu4';

// Initialize immediately when script loads
let supabase = null;

function initSupabase() {
    if (!supabase && typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client initialized');
    }
    return supabase;
}

// Auto-initialize if window.supabase is already available
if (typeof window !== 'undefined' && typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase auto-initialized on load');
}

// ========== Authentication ==========

async function signUp(email, password, fullName, phone) {
    try {
        // Ensure Supabase is initialized
        if (!supabase) {
            initSupabase();
        }
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone
                }
            }
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
    }
}

async function signIn(email, password) {
    try {
        // Ensure Supabase is initialized
        if (!supabase) {
            initSupabase();
        }
        if (!supabase) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
    }
}

async function signOut() {
    try {
        if (!supabase) {
            initSupabase();
        }

        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

async function getCurrentUser() {
    try {
        if (!supabase) {
            initSupabase();
        }
        if (!supabase) {
            return null;
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
}

async function resetPassword(email) {
    try {
        if (!supabase) {
            initSupabase();
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
    }
}

// ========== Business Settings ==========

async function getBusinessInfo() {
    try {
        const { data, error } = await supabase
            .from('business_settings')
            .select('*')
            .limit(1)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Get business info error:', error);
        return null;
    }
}

// ========== Cars ==========

async function getUserCars(userId) {
    try {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Get cars error:', error);
        return [];
    }
}

async function addCar(userId, brandModel, licensePlate) {
    try {
        const { data, error } = await supabase
            .from('cars')
            .insert([{
                user_id: userId,
                brand_model: brandModel,
                license_plate: licensePlate
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Add car error:', error);
        return { success: false, error: error.message };
    }
}

async function updateCar(carId, brandModel, licensePlate) {
    try {
        const { data, error } = await supabase
            .from('cars')
            .update({
                brand_model: brandModel,
                license_plate: licensePlate,
                updated_at: new Date().toISOString()
            })
            .eq('id', carId)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Update car error:', error);
        return { success: false, error: error.message };
    }
}

async function deleteCar(carId) {
    try {
        const { error } = await supabase
            .from('cars')
            .delete()
            .eq('id', carId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Delete car error:', error);
        return { success: false, error: error.message };
    }
}

// ========== Addresses ==========

async function getUserAddresses(userId) {
    try {
        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Get addresses error:', error);
        return [];
    }
}

async function addAddress(userId, label, street, city, zipCode, latitude, longitude) {
    try {
        const { data, error } = await supabase
            .from('addresses')
            .insert([{
                user_id: userId,
                label,
                street,
                city,
                zip_code: zipCode,
                latitude: latitude || null,
                longitude: longitude || null
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Add address error:', error);
        return { success: false, error: error.message };
    }
}

async function updateAddress(addressId, label, street, city, zipCode, latitude, longitude) {
    try {
        const { data, error } = await supabase
            .from('addresses')
            .update({
                label,
                street,
                city,
                zip_code: zipCode,
                latitude: latitude || null,
                longitude: longitude || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', addressId)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Update address error:', error);
        return { success: false, error: error.message };
    }
}

async function deleteAddress(addressId) {
    try {
        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', addressId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Delete address error:', error);
        return { success: false, error: error.message };
    }
}

// ========== Bookings ==========

async function getUserBookings(userId, status = null) {
    try {
        let query = supabase
            .from('bookings')
            .select(`
        *,
        cars (
          brand_model,
          license_plate
        )
      `)
            .eq('user_id', userId)
            .order('booking_date', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Get bookings error:', error);
        return [];
    }
}

async function createBooking(userId, carId, bookingDate, timeSlot, location, notes) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                user_id: userId,
                car_id: carId,
                booking_date: bookingDate,
                time_slot: timeSlot,
                location,
                notes,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Create booking error:', error);
        return { success: false, error: error.message };
    }
}

async function updateBookingStatus(bookingId, status) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Update booking status error:', error);
        return { success: false, error: error.message };
    }
}

async function cancelBooking(bookingId) {
    return await updateBookingStatus(bookingId, 'cancelled');
}

async function getAvailableSlots(date) {
    const allSlots = [
        '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
        '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'
    ];

    if (!supabase) {
        console.warn('Supabase not initialized, returning all slots');
        return allSlots;
    }

    try {
        console.log('🔍 Checking available slots for date:', date);

        // Fetch ALL bookings for this date regardless of status first
        const { data, error } = await supabase
            .from('bookings')
            .select('time_slot, status, booking_date')
            .eq('booking_date', date);

        if (error) {
            console.error('Error fetching bookings:', error);
            throw error;
        }

        console.log('📅 All bookings found for date:', data);

        // Filter active bookings in JavaScript (handles case sensitivity)
        const activeBookings = data.filter(b => {
            const status = (b.status || '').toLowerCase().trim();
            return status === 'pending' || status === 'confirmed';
        });

        console.log('✅ Active bookings:', activeBookings);

        const bookedSlots = activeBookings.map(b => (b.time_slot || '').trim());
        console.log('⏰ Booked slots (normalized):', bookedSlots);

        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
        console.log('✅ Available slots:', availableSlots);

        return availableSlots;
    } catch (error) {
        console.error('Get available slots error:', error);
        // Return all slots if there's an error to not block users
        return allSlots;
    }
}

// Supabase client is auto-initialized when script loads
