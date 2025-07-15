import React, { useState } from 'react';
import Navbar from './Navbar'; // Assuming NavBar.jsx is in the same directory

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle

  return (
    <div className="flex h-screen">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'ml-15' : 'ml-20'} transition-all duration-300`}>
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            {/* The toggle button is now part of the Navbar component */}
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>🔔</span>
            <span className="flex items-center space-x-2">
              <span className="text-sm" id="user-display-name">Dominic Keller</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <label htmlFor="profile-name" className="block text-gray-700">Name</label>
                  <input type="text" id="profile-name" className="w-full border px-2 py-1 rounded" defaultValue="Dominic Keller" />
                </div>
                <div>
                  <label htmlFor="profile-email" className="block text-gray-700">Email</label>
                  <input type="email" id="profile-email" className="w-full border px-2 py-1 rounded" defaultValue="dominic@email.com" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Email Alerts</span>
                  <label className="toggle-switch">
                    <input type="checkbox" id="email-alerts-toggle" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <span>SMS Notifications</span>
                  <label className="toggle-switch">
                    <input type="checkbox" id="sms-notifications-toggle" />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="flex justify-between items-center">
                  <span>Weekly Reports</span>
                  <label className="toggle-switch">
                    <input type="checkbox" id="weekly-reports-toggle" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Preferences</h3>
              <div className="space-y-4 text-sm">

                <div className="border-b pb-4 mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">General</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="default-currency" className="block text-gray-700">Default Currency</label>
                      <select id="default-currency" className="w-full border px-2 py-1 rounded" defaultValue="ARS">
                        <option value="USD">USD - United States Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="ARS">ARS - Argentine Peso</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date-format" className="block text-gray-700">Date Format</label>
                      <select id="date-format" className="w-full border px-2 py-1 rounded" defaultValue="MM/DD/YYYY">
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="time-zone" className="block text-gray-700">Time Zone</label>
                      <select id="time-zone" className="w-full border px-2 py-1 rounded" defaultValue="America/Buenos_Aires">
                        <option value="America/New_York">(GMT-05:00) Eastern Time (US & Canada)</option>
                        <option value="America/Chicago">(GMT-06:00) Central Time (US & Canada)</option>
                        <option value="America/Denver">(GMT-07:00) Mountain Time (US & Canada)</option>
                        <option value="America/Los_Angeles">(GMT-08:00) Pacific Time (US & Canada)</option>
                        <option value="America/Buenos_Aires">(GMT-03:00) Buenos Aires</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Enable Dark Mode (Applies to UI)</span>
                      <label className="toggle-switch">
                        <input type="checkbox" id="dark-mode-toggle" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4 mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Onboarding</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="default-onboarding-template" className="block text-gray-700">Default Onboarding Template</label>
                      <select id="default-onboarding-template" className="w-full border px-2 py-1 rounded">
                        <option value="Standard Employee Onboarding">Standard Employee Onboarding</option>
                        <option value="Contractor Onboarding">Contractor Onboarding</option>
                        <option value="Sales Team Onboarding">Sales Team Onboarding</option>
                        <option value="Tech Team Onboarding">Tech Team Onboarding</option>
                        <option value="Custom Template">Custom Template</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Automate Welcome Emails</span>
                      <label className="toggle-switch">
                        <input type="checkbox" id="automate-welcome-emails-toggle" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Require Equipment Acknowledgment</span>
                      <label className="toggle-switch">
                        <input type="checkbox" id="require-equipment-acknowledgment-toggle" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div>
                      <label htmlFor="onboarding-completion-threshold" className="block text-gray-700">Onboarding Completion Threshold (%)</label>
                      <input type="number" min="0" max="100" id="onboarding-completion-threshold" className="w-full border px-2 py-1 rounded" defaultValue="90" />
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4 mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Equipment Management</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="asset-tag-prefix" className="block text-gray-700">Default Asset Tag Prefix</label>
                      <input type="text" id="asset-tag-prefix" className="w-full border px-2 py-1 rounded" defaultValue="ONB-EQ-" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Enable Low Stock Alerts</span>
                      <label className="toggle-switch">
                        <input type="checkbox" id="low-stock-alerts-toggle" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div>
                      <label htmlFor="low-stock-threshold" className="block text-gray-700">Low Stock Threshold (Units)</label>
                      <input type="number" min="1" id="low-stock-threshold" className="w-full border px-2 py-1 rounded" defaultValue="5" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Automate Return Reminders</span>
                      <label className="toggle-switch">
                        <input type="checkbox" id="automate-return-reminders-toggle" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4 mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Integrations</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Sync with HRIS (e.g., BambooHR, Workday)</span>
                      <label className="toggle-switch">
                        <input type="checkbox" id="sync-hris-toggle" />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Connect with IT Ticketing System (e.g., Jira, Zendesk)</span>
                      <label className="toggle-switch">
                        <input type="checkbox" id="it-ticketing-toggle" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4 mb-4">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Data & Privacy</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="data-retention-days" className="block text-gray-700">Data Retention Period (Days)</label>
                      <input type="number" min="30" id="data-retention-days" className="w-full border px-2 py-1 rounded" defaultValue="365" />
                      <p className="text-xs text-gray-500 mt-1">Data older than this period may be archived or deleted.</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Enable Audit Logging</span>
                      <label className="toggle-switch">
                        <input type="checkbox" id="audit-logging-toggle" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div>
                      <button id="export-data-button" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Export All Data</button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-2">Security</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Enable Two-Factor Authentication (2FA) for all users</span>
                      <label className="toggle-switch">
                        <input type="checkbox" id="two-factor-auth-toggle" />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div>
                      <label htmlFor="password-policy" className="block text-gray-700">Password Policy</label>
                      <select id="password-policy" className="w-full border px-2 py-1 rounded" defaultValue="min12_complex">
                        <option value="min8">Minimum 8 characters</option>
                        <option value="min12_complex">Minimum 12 characters, uppercase, lowercase, number, symbol</option>
                      </select>
                    </div>
                    <div>
                      <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">Manage API Keys</button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button id="save-changes-button" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Save Changes</button>
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