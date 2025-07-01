const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Required for frontend and backend to talk across different ports

const app = express();
const PORT = process.env.PORT || 3001; // Backend will run on port 3001

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes - IMPORTANT for frontend communication
app.use(express.json()); // Enable parsing of JSON request bodies

// --- MongoDB Connection ---
const MONGODB_URI = 'mongodb://localhost:27017/onbordea_me_settings'; // Replace with your MongoDB connection string
// If using MongoDB Atlas, it will look like:
// 'mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- MongoDB Schemas & Models ---

// UserProfile Schema
const userProfileSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Use String to store the USER_ID from frontend
    display_name: { type: String, default: '' },
    email: { type: String, default: '' },
    email_alerts: { type: Boolean, default: false },
    sms_notifications: { type: Boolean, default: false },
    weekly_reports: { type: Boolean, default: false },
    // Add other fields from user profile section
}, { _id: false }); // Do not auto-generate _id, use the one provided

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

// AppSettings Schema (for global settings - usually one document)
const appSettingsSchema = new mongoose.Schema({
    // Since we're treating this as a single document, we don't strictly need an _id here,
    // but often use a fixed key or just ensure only one document is created.
    // We'll use a fixed _id for consistency with the frontend assumption (APP_SETTINGS_SINGLE_ROW_ID = 1)
    _id: { type: Number, default: 1 }, // Fixed ID for the single global settings document
    default_currency: { type: String, default: 'USD' },
    date_format: { type: String, default: 'MM/DD/YYYY' },
    time_zone: { type: String, default: 'America/New_York' },
    dark_mode_enabled: { type: Boolean, default: false },
    default_onboarding_template: { type: String, default: 'Standard Employee Onboarding' },
    automate_welcome_emails: { type: Boolean, default: true },
    required_equipment_acknowledgment: { type: Boolean, default: true }, // Corrected name based on HTML
    onboarding_completion_threshold: { type: Number, default: 90 },
    asset_tag_prefix: { type: String, default: 'ONB-EQ-' },
    low_stock_alerts_enabled: { type: Boolean, default: true },
    low_stock_threshold_units: { type: Number, default: 5 },
    automate_return_reminders: { type: Boolean, default: false },
    sync_hris_enabled: { type: Boolean, default: false },
    it_ticketing_integration_enabled: { type: Boolean, default: false },
    data_retention_days: { type: Number, default: 365 },
    audit_logging_enabled: { type: Boolean, default: true },
    two_factor_auth_enabled: { type: Boolean, default: false },
    password_policy: { type: String, default: 'min12_complex' },
}, { _id: false }); // Do not auto-generate _id, we're setting it to 1

const AppSettings = mongoose.model('AppSettings', appSettingsSchema);


// --- API Endpoints ---

// Get User Profile Settings
app.get('/api/settings/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        let userProfile = await UserProfile.findById(userId);

        if (!userProfile) {
            // If no profile found, create a default one for this user ID
            userProfile = new UserProfile({
                _id: userId,
                display_name: 'New User', // Default for new profile
                email: `${userId}@example.com`, // Placeholder email
                email_alerts: true,
                sms_notifications: false,
                weekly_reports: true,
            });
            await userProfile.save();
            console.log(`New profile created for user: ${userId}`);
        }
        res.json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
});

// Update User Profile Settings
app.put('/api/settings/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedData = req.body;

        // In a real app, you'd verify the user's identity here (e.g., from a JWT)
        // to ensure they can only update their own profile.
        const userProfile = await UserProfile.findByIdAndUpdate(
            userId,
            { $set: updatedData }, // Use $set to update specific fields
            { new: true, upsert: true, runValidators: true } // new: return updated doc, upsert: create if not exists
        );

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.json({ message: 'Profile settings updated successfully!', userProfile });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
});

// Get App Settings
app.get('/api/settings/app', async (req, res) => {
    try {
        // Assuming there's only one global settings document with _id = 1
        let appSettings = await AppSettings.findById(1);

        if (!appSettings) {
            // If no app settings found, create default ones
            appSettings = new AppSettings({
                _id: 1, // Explicitly set ID
                default_currency: 'USD',
                date_format: 'MM/DD/YYYY',
                time_zone: 'America/New_York',
                dark_mode_enabled: false,
                default_onboarding_template: 'Standard Employee Onboarding',
                automate_welcome_emails: true,
                required_equipment_acknowledgment: true,
                onboarding_completion_threshold: 90,
                asset_tag_prefix: 'ONB-EQ-',
                low_stock_alerts_enabled: true,
                low_stock_threshold_units: 5,
                automate_return_reminders: false,
                sync_hris_enabled: false,
                it_ticketing_integration_enabled: false,
                data_retention_days: 365,
                audit_logging_enabled: true,
                two_factor_auth_enabled: false,
                password_policy: 'min12_complex',
            });
            await appSettings.save();
            console.log('Default app settings created.');
        }
        res.json(appSettings);
    } catch (error) {
        console.error('Error fetching app settings:', error);
        res.status(500).json({ message: 'Error fetching app settings', error: error.message });
    }
});

// Update App Settings
app.put('/api/settings/app', async (req, res) => {
    try {
        const updatedData = req.body;
        // In a real app, this endpoint should be protected by administrator authentication
        const appSettings = await AppSettings.findByIdAndUpdate(
            1, // Target the single document with _id = 1
            { $set: updatedData },
            { new: true, upsert: true, runValidators: true } // new: return updated doc, upsert: create if not exists
        );

        if (!appSettings) {
            return res.status(404).json({ message: 'App settings document not found' });
        }
        res.json({ message: 'App settings updated successfully!', appSettings });
    } catch (error) {
        console.error('Error updating app settings:', error);
        res.status(500).json({ message: 'Error updating app settings', error: error.message });
    }
});


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});