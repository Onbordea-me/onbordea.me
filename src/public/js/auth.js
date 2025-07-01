// frontend/js/auth.js

// --- Supabase Configuration ---
// IMPORTANT: Replace with your actual Supabase project URL and Anon Key
// Get these from your Supabase Dashboard -> Project Settings -> API
const SUPABASE_URL = 'https://plztqnszikysepsoawhy.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsenRxbnN6aWt5c2Vwc29hd2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODAxNTUsImV4cCI6MjA2NTc1NjE1NX0.Sjqk7ulL4wW8dg1hyyEP2NVCsMd0RcNbUUN8X1WQEog'; 

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM Elements ---
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nameSignupInput = document.getElementById('name-signup');
const signupBtn = document.getElementById('signup-btn');
const signinBtn = document.getElementById('signin-btn');
const authMessage = document.getElementById('auth-message');

// --- Functions ---

/**
 * Handles user sign-up: creates an Auth user and a corresponding profile in the 'user_profiles' table.
 */
async function signUp() {
    authMessage.textContent = ''; // Clear previous messages
    const email = emailInput.value;
    const password = passwordInput.value;
    const name = nameSignupInput.value;

    if (!email || !password || !name) {
        authMessage.textContent = 'Please fill in all fields.';
        return;
    }

    try {
        // 1. Sign up the user with Supabase Auth
        // This creates an entry in auth.users
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            // You can optionally pass user_metadata here, but for custom profiles,
            // inserting into a separate table is more flexible and recommended.
        });

        if (authError) {
            throw authError; // Propagate the error for handling below
        }

        // If signup is successful and a user object is returned
        if (authData.user) {
            // 2. Create a corresponding profile in your 'user_profiles' table
            // The RLS policy 'Allow user to create their own profile' must be active.
            const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                    id: authData.user.id, // Link the profile to the auth.users ID
                    name: name           // Save the name provided during signup
                });

            if (profileError) {
                // Log the profile creation error but don't prevent the signup alert,
                // as the Auth user was still created. User can update name later.
                console.error('Error creating user profile in DB:', profileError);
                authMessage.textContent = 'Sign up successful! Profile name not saved (please update after login). Redirecting...';
            } else {
                authMessage.textContent = 'Sign up successful! Redirecting...';
                console.log('User signed up and profile created for ID:', authData.user.id);
                // The onAuthStateChange listener will automatically handle the redirection.
            }
        }
    } catch (error) {
        // Display a user-friendly error message
        authMessage.textContent = 'Sign up failed: ' + error.message;
        console.error('Sign up error:', error);
    }
}

/**
 * Handles user sign-in.
 */
async function signIn() {
    authMessage.textContent = ''; // Clear previous messages
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        authMessage.textContent = 'Please enter email and password.';
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            throw error; // Propagate the error for handling below
        }
        authMessage.textContent = 'Signed in successfully! Redirecting...';
        console.log('User signed in:', data.user.id);
        // The onAuthStateChange listener will automatically handle the redirection.
    } catch (error) {
        authMessage.textContent = 'Sign in failed: ' + error.message;
        console.error('Sign in error:', error);
    }
}

// --- Auth State Change Listener for Redirection ---
// This listener runs whenever the user's authentication status changes (login, logout, session refresh).
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event on login page:', event);
    if (session) {
        // If the session object exists, it means the user is logged in.
        // Redirect them to the main application page (your dashboard).
        console.log('Session detected. Redirecting to index.html.');
        // Adjust the path 'index.html' if your main dashboard is in a different location
        // relative to login.html (e.g., if login.html is in 'pages' and index.html is in 'pages', just 'index.html' is fine)
        window.location.href = 'index.html';
    }
    // No 'else' needed here, as if session is null, it means they are logged out or signing out,
    // and they should remain on the login page or be directed back to it.
});

// --- Event Listeners ---
signupBtn.addEventListener('click', signUp);
signinBtn.addEventListener('click', signIn);

// --- Initial Check on Page Load ---
// This part ensures that if a user directly navigates to login.html but is already logged in
// (e.g., from a previous session or if they signed up/in elsewhere), they are immediately redirected.
document.addEventListener('DOMContentLoaded', async () => {
    console.log('login.html DOMContentLoaded. Checking session...');
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        console.log('Existing session found on login.html. Redirecting...');
        window.location.href = 'index.html'; // Redirect if already logged in
    }
});
