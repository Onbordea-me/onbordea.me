const SUPABASE_URL = 'https://plztqnszikysepsoawhy.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsenRxbnN6aWt5c2Vwc29hd2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxODAxNTUsImV4cCI6MjA2NTc1NjE1NX0.Sjqk7ulL4wW8dg1hyyEP2NVCsMd0RcNbUUN8X1WQEog'; 

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Sidebar Toggle Logic (keep your existing sidebar JS here) ---
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarLabels = document.querySelectorAll('.sidebar-label');
const logo = document.getElementById('logo');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('w-20');
  sidebar.classList.toggle('w-64'); // Adjust this width for expanded state

  sidebarLabels.forEach(label => {
    label.classList.toggle('hidden');
  });

  // Adjust logo size based on sidebar state
  if (sidebar.classList.contains('w-64')) {
    logo.style.width = '100px'; // Larger size when expanded
    logo.style.height = 'auto';
    // Assuming you have a full logo for expanded view, otherwise remove this line or keep original
    // logo.src = 'assets/logo-full.png';
  } else {
    logo.style.width = 'auto'; // Original size
    logo.style.height = 'auto';
    // logo.src = 'assets/logo.png'; // Original logo for collapsed view
  }
});


// --- Supabase Settings Logic ---

// 1. Get references to all your form elements (inputs, selects, checkboxes)
// Elements for Profile and Notifications
const profileNameInput = document.getElementById('profile-name');
const profileEmailInput = document.getElementById('profile-email');
const emailAlertsToggle = document.getElementById('email-alerts-toggle');
const smsNotificationsToggle = document.getElementById('sms-notifications-toggle');
const weeklyReportsToggle = document.getElementById('weekly-reports-toggle');
const userDisplayName = document.getElementById('user-display-name');

// Elements for System Preferences
const defaultCurrencySelect = document.getElementById('default-currency');
const dateFormatSelect = document.getElementById('date-format');
const timeZoneSelect = document.getElementById('time-zone');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const defaultOnboardingTemplateSelect = document.getElementById('default-onboarding-template');
const automateWelcomeEmailsToggle = document.getElementById('automate-welcome-emails-toggle');
const requireEquipmentAcknowledgmentToggle = document.getElementById('require-equipment-acknowledgment-toggle');
const onboardingCompletionThresholdInput = document.getElementById('onboarding-completion-threshold');
const assetTagPrefixInput = document.getElementById('asset-tag-prefix');
const lowStockAlertsToggle = document.getElementById('low-stock-alerts-toggle');
const lowStockThresholdInput = document.getElementById('low-stock-threshold');
const automateReturnRemindersToggle = document.getElementById('automate-return-reminders-toggle');
const syncHrisToggle = document.getElementById('sync-hris-toggle');
const itTicketingToggle = document.getElementById('it-ticketing-toggle');
const dataRetentionDaysInput = document.getElementById('data-retention-days');
const auditLoggingToggle = document.getElementById('audit-logging-toggle');
const twoFactorAuthToggle = document.getElementById('two-factor-auth-toggle');
const passwordPolicySelect = document.getElementById('password-policy');
const saveChangesButton = document.getElementById('save-changes-button');


/**
 * Fetches current user and app settings from Supabase and populates the form fields.
 */
async function loadSettings() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  const user = session?.user;

  if (sessionError) {
    console.error('Error getting session:', sessionError);
  }

  if (user) {
    profileEmailInput.value = user.email || '';
    userDisplayName.textContent = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      console.warn('No user profile found, creating one...');
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'New User',
          email_alerts: true,
          sms_notifications: false,
          weekly_reports: true
        });
      if (insertError) {
        console.error('Error creating user profile:', insertError);
      } else {
        console.log('User profile created.');
        profileNameInput.value = user.user_metadata?.display_name || user.email?.split('@')[0] || 'New User';
        emailAlertsToggle.checked = true;
        smsNotificationsToggle.checked = false;
        weeklyReportsToggle.checked = true;
      }
    } else if (profileError) {
      console.error('Error loading user profile:', profileError);
      alert('Error loading your profile settings. Please try again.');
    } else if (profile) {
      profileNameInput.value = profile.display_name || '';
      emailAlertsToggle.checked = profile.email_alerts;
      smsNotificationsToggle.checked = profile.sms_notifications;
      weeklyReportsToggle.checked = profile.weekly_reports;
    }
  } else {
    console.warn('User not authenticated. Some settings might not load or be editable.');
    document.querySelectorAll('input, select, button').forEach(el => {
        if (el.id !== 'sidebar-toggle') {
            el.disabled = true;
        }
    });
    userDisplayName.textContent = 'Guest';
    profileEmailInput.value = 'Sign in to manage settings';
    profileNameInput.value = 'Guest User';
  }

  const { data: appSettings, error: appSettingsError } = await supabase
    .from('app_settings')
    .select('*')
    .limit(1)
    .single();

  if (appSettingsError && appSettingsError.code === 'PGRST116') {
       console.warn('No app settings found. Using default values for display.');
  } else if (appSettingsError) {
    console.error('Error loading app settings:', appSettingsError);
    alert('Error loading system settings. Please try again.');
  } else if (appSettings) {
    defaultCurrencySelect.value = appSettings.default_currency || 'USD';
    dateFormatSelect.value = appSettings.date_format || 'MM/DD/YYYY';
    timeZoneSelect.value = appSettings.time_zone || 'America/New_York';
    darkModeToggle.checked = appSettings.dark_mode_enabled;
    defaultOnboardingTemplateSelect.value = appSettings.default_onboarding_template || 'Standard Employee Onboarding';
    automateWelcomeEmailsToggle.checked = appSettings.automate_welcome_emails;
    requireEquipmentAcknowledgmentToggle.checked = appSettings.require_equipment_acknowledgment;
    onboardingCompletionThresholdInput.value = appSettings.onboarding_completion_threshold;
    assetTagPrefixInput.value = appSettings.asset_tag_prefix || 'ONB-EQ-';
    lowStockAlertsToggle.checked = appSettings.low_stock_alerts_enabled;
    lowStockThresholdInput.value = appSettings.low_stock_threshold_units;
    automateReturnRemindersToggle.checked = appSettings.automate_return_reminders;
    syncHrisToggle.checked = appSettings.sync_hris_enabled;
    itTicketingToggle.checked = appSettings.it_ticketing_integration_enabled;
    dataRetentionDaysInput.value = appSettings.data_retention_days;
    auditLoggingToggle.checked = appSettings.audit_logging_enabled;
    twoFactorAuthToggle.checked = appSettings.two_factor_auth_enabled;
    passwordPolicySelect.value = appSettings.password_policy || 'min12_complex';
  }
}

/**
 * Gathers data from form fields and sends updates to Supabase.
 */
async function saveSettings() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  const user = session?.user;

  if (sessionError || !user) {
    console.error('User not authenticated. Cannot save settings.');
    alert('You must be logged in to save settings.');
    return;
  }

  try {
      const { error: profileUpdateError } = await supabase
          .from('user_profiles')
          .update({
              display_name: profileNameInput.value,
              email_alerts: emailAlertsToggle.checked,
              sms_notifications: smsNotificationsToggle.checked,
              weekly_reports: weeklyReportsToggle.checked,
          })
          .eq('id', user.id);

      if (profileUpdateError) {
          throw new Error('Profile update failed: ' + profileUpdateError.message);
      } else {
          console.log('Profile settings saved successfully!');
          userDisplayName.textContent = profileNameInput.value;
      }

      if (user.email !== profileEmailInput.value && profileEmailInput.value.trim() !== '') {
          const { error: emailUpdateError } = await supabase.auth.updateUser({ email: profileEmailInput.value });
          if (emailUpdateError) {
              throw new Error('Email update failed: ' + emailUpdateError.message);
          } else {
              console.log('Email update initiated. Check your inbox for confirmation.');
              alert('Email update initiated. Please check your inbox for confirmation to finalize the change.');
          }
      }

  } catch (error) {
      console.error('Error in saving user profile:', error);
      alert('Failed to save profile settings: ' + error.message);
  }

  const APP_SETTINGS_SINGLE_ROW_ID = 1;

  try {
      const { error: appSettingsUpdateError } = await supabase
          .from('app_settings')
          .update({
              default_currency: defaultCurrencySelect.value,
              date_format: dateFormatSelect.value,
              time_zone: timeZoneSelect.value,
              dark_mode_enabled: darkModeToggle.checked,
              default_onboarding_template: defaultOnboardingTemplateSelect.value,
              automate_welcome_emails: automateWelcomeEmailsToggle.checked,
              require_equipment_acknowledgment: requireEquipmentAcknowledgmentToggle.checked,
              onboarding_completion_threshold: parseInt(onboardingCompletionThresholdInput.value),
              asset_tag_prefix: assetTagPrefixInput.value,
              low_stock_alerts_enabled: lowStockAlertsToggle.checked,
              low_stock_threshold_units: parseInt(lowStockThresholdInput.value),
              automate_return_reminders: automateReturnRemindersToggle.checked,
              sync_hris_enabled: syncHrisToggle.checked,
              it_ticketing_integration_enabled: itTicketingToggle.checked,
              data_retention_days: parseInt(dataRetentionDaysInput.value),
              audit_logging_enabled: auditLoggingToggle.checked,
              two_factor_auth_enabled: twoFactorAuthToggle.checked,
              password_policy: passwordPolicySelect.value,
          })
          .eq('id', APP_SETTINGS_SINGLE_ROW_ID);

      if (appSettingsUpdateError) {
          throw new Error('System settings update failed: ' + appSettingsUpdateError.message);
      } else {
          console.log('System settings saved successfully!');
          alert('All settings saved successfully!');
      }
  } catch (error) {
      console.error('Error in saving app settings:', error);
      alert('Failed to save system settings: ' + error.message);
  }
}

// Add Event Listeners
document.addEventListener('DOMContentLoaded', loadSettings);
saveChangesButton.addEventListener('click', saveSettings);

document.getElementById('export-data-button').addEventListener('click', () => {
    alert('Data export feature initiated! (This would typically trigger a secure backend process).');
});