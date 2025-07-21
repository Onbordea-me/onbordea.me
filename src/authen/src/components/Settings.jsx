import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient';

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    profile_name: '',
    email_alerts: true,
    sms_notifications: false,
    weekly_reports: true,
    default_currency: 'ARS',
    date_format: 'MM/DD/YYYY',
    time_zone: 'America/Buenos_Aires',
    dark_mode: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndSettings = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching settings:', error);
          } else if (data) {
            setSettings(data);
          } else {
            const defaultSettings = {
              user_id: user.id,
              profile_name: user.user_metadata?.name || 'Dominic Keller',
              ...settings,
            };
            const { error: insertError } = await supabase
              .from('user_settings')
              .insert(defaultSettings);
            if (insertError) {
              console.error('Error initializing settings:', insertError);
            }
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndSettings();
  }, []);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    console.log('Input changed:', id, value, type, checked); // Debug log
    const fieldName = id.replace(/-/, '_'); // Replace hyphen with underscore for state keys
    setSettings((prev) => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    try {
      const payload = {
        user_id: user.id,
        profile_name: settings.profile_name,
        email_alerts: settings.email_alerts,
        sms_notifications: settings.sms_notifications,
        weekly_reports: settings.weekly_reports,
        default_currency: settings.default_currency,
        date_format: settings.date_format,
        time_zone: settings.time_zone,
        dark_mode: settings.dark_mode,
        updated_at: new Date().toISOString(),
      };
      console.log('Saving payload:', payload); // Debug log
      const { error } = await supabase
        .from('user_settings')
        .upsert(payload);
      if (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings. Check console for details.');
      } else {
        alert('Settings saved successfully!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <div className="flex h-screen bg-gray-900 text-white items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-15' : 'ml-20'}`}>
        <header className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400">🔔</span>
            <span className="text-sm">
              {user ? `${settings.profile_name || 'User'}` : 'Loading...'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-8">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Section */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">👤 Profile</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <label htmlFor="profile-name" className="block text-gray-300">Name</label>
                  <input
                    type="text"
                    id="profile-name"
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.profile_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="profile-email" className="block text-gray-300">Email</label>
                  <input
                    type="email"
                    id="profile-email"
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={user?.email || ''}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">🔔 Notifications</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Email Alerts</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="email_alerts"
                      className="sr-only peer"
                      checked={settings.email_alerts}
                      onChange={handleInputChange}
                    />
                    <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">SMS Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="sms_notifications"
                      className="sr-only peer"
                      checked={settings.sms_notifications}
                      onChange={handleInputChange}
                    />
                    <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Weekly Reports</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="weekly_reports"
                      className="sr-only peer"
                      checked={settings.weekly_reports}
                      onChange={handleInputChange}
                    />
                    <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* System Preferences Section */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 shadow-lg md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">⚙️ System Preferences</h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-300">General</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="default-currency" className="block text-gray-300">Default Currency</label>
                      <select
                        id="default-currency"
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={settings.default_currency}
                        onChange={handleInputChange}
                      >
                        <option value="USD">USD - United States Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="ARS">ARS - Argentine Peso</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date-format" className="block text-gray-300">Date Format</label>
                      <select
                        id="date-format"
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={settings.date_format}
                        onChange={handleInputChange}
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="time-zone" className="block text-gray-300">Time Zone</label>
                      <select
                        id="time-zone"
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={settings.time_zone}
                        onChange={handleInputChange}
                      >
                        <option value="America/New_York">(GMT-05:00) Eastern Time (US & Canada)</option>
                        <option value="America/Chicago">(GMT-06:00) Central Time (US & Canada)</option>
                        <option value="America/Denver">(GMT-07:00) Mountain Time (US & Canada)</option>
                        <option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
                        <option value="America/Buenos_Aires">(GMT-03:00) Buenos Aires</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Enable Dark Mode</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="dark_mode"
                          className="sr-only peer"
                          checked={settings.dark_mode}
                          onChange={handleInputChange}
                        />
                        <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-6 border-t border-gray-700">
                  <button
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;