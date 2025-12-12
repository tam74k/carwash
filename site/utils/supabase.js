// utils/supabase.js
// This would typically be initialized with your Supabase URL and public key.
// For security in a real app, these might come from environment variables.
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hvkxrriietvziwqmjyqi.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2a3hycmlpZXR2eml3cW1qeXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNDc3NjUsImV4cCI6MjA4MDcyMzc2NX0.RHCQnRmCoCOhvs4yhwT3kGef9Z-mRWEDCmCq03WiRu4'; // Replace with your Supabase Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Auth Functions ---
export async function signIn(email, password) {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;
    return user;
}

export async function signUp(email, password) {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return user;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUser() {
    const user = supabase.auth.user();
    return user;
}

// --- Data Fetching Examples ---
export async function getBusinessInfo() {
    const { data, error } = await supabase
        .from('business_settings')
        .select('name, logo_url')
        .single();
    if (error) throw error;
    return data;
}

export async function getCars(userId) {
    const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data;
}

export async function getUpcomingBookings(userId) {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .gte('booking_date', new Date().toISOString().split('T')[0]) // Only future bookings
        .order('booking_date', { ascending: true });
    if (error) throw error;
    return data;
}

// Add more Supabase functions as needed for bookings, addresses, profile updates etc.