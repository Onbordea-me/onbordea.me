// --- Supabase Configuration ---
const SUPABASE_URL = 'https://plztqnszikysepsoawhy.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsenRxbnN6aWt5c2Vwc29hd2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODAxNTUsImV4cCI6MjA2NTc1NjE1NX0.Sjqk7ulL4wW8dg1hyyEP2NVCsMd0RcNbUUN8X1WQEog'; 

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM Elements ---
const userDisplayName = document.getElementById('user-display-name');
const signoutBtnNavbar = document.getElementById('signout-btn-navbar');

// --- Functions ---

async function checkAuthAndLoadUserInfo() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error getting session:', error);
    }

    if (!session) {
        // User is not logged in, redirect to login page
        console.log('No session found. Redirecting to login page.');
        window.location.href = 'login.html'; // Adjust path if login.html is not in the same directory
        return; // Stop further execution
    }

    // User is logged in, display their info
    userDisplayName.textContent = session.user.email; // Default to email

    // Try to fetch display name from user_profiles table
    try {
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('name')
            .eq('id', session.user.id)
            .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no row found
            console.error('Error loading user profile name:', profileError);
        } else if (profile && profile.name) {
            userDisplayName.textContent = profile.name;
        } else {
            // If no profile or name, fallback to email and suggest updating profile
            console.warn('User profile name not found. Displaying email.');
        }
    } catch (profileFetchError) {
        console.error('Network or unexpected error fetching profile:', profileFetchError);
    }
}

async function signOutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Sign out error:', error);
        alert('Failed to sign out: ' + error.message);
    } else {
        console.log('User signed out from main app.');
        // Redirect to login page after successful sign out
        window.location.href = 'login.html'; // Adjust path
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', checkAuthAndLoadUserInfo);
signoutBtnNavbar.addEventListener('click', signOutUser);

// Listen for auth state changes (e.g., if session expires or user signs out from another tab)
supabase.auth.onAuthStateChange((event, session) => {
    if (!session && event === 'SIGNED_OUT') {
        console.log('Auth state changed to SIGNED_OUT. Redirecting to login.');
        window.location.href = 'login.html'; // Ensure redirect if signed out
    }
    // You could also re-run checkAuthAndLoadUserInfo if event is 'SIGNED_IN'
});

