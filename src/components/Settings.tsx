import React, { useMemo, useState } from 'react';
import Layout from './Layout';
import { Camera, Mail, Phone, Lock, Globe2, Bell, Shield, Trash2, MonitorSmartphone, LogOut } from 'lucide-react';

const Settings: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  // Profile
  const [fullName, setFullName] = useState('Adjei Godfred Emmanuel');
  const [email, setEmail] = useState('user@example.com');
  const [phone, setPhone] = useState('+233 000 000 000');

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const canChangePassword = useMemo(() => newPassword.length >= 8 && newPassword === confirmPassword && currentPassword.length > 0, [currentPassword, newPassword, confirmPassword]);

  // Preferences
  const [locale, setLocale] = useState('en-GH');
  const [currency, setCurrency] = useState('GHS');
  const [theme, setTheme] = useState<'system'|'light'|'dark'>('system');

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);

  // 2FA
  const [twoFA, setTwoFA] = useState(false);

  const sessions = [
    { device: 'Chrome on Windows', location: 'Accra, GH', lastActive: 'Just now', current: true },
    { device: 'iPhone 14 Pro', location: 'Tema, GH', lastActive: '2 days ago', current: false },
  ];

  return (
    <Layout onNavigate={onNavigate}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile & Security column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Profile */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-bold mb-4">Profile</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center text-xl font-bold">{initials(fullName)}
                <button className="absolute -bottom-1 -right-1 p-1 rounded-full bg-orange-500 text-white"><Camera className="w-3 h-3" /></button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Update your personal information and how others see you.</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LabeledInput icon={<Mail className="w-4 h-4" />} label="Full name" value={fullName} onChange={setFullName} />
              <LabeledInput icon={<Mail className="w-4 h-4" />} label="Email" value={email} onChange={setEmail} type="email" />
              <LabeledInput icon={<Phone className="w-4 h-4" />} label="Phone" value={phone} onChange={setPhone} />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">Save changes</button>
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">Cancel</button>
            </div>
          </section>

          {/* Security */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-bold mb-4">Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LabeledInput icon={<Lock className="w-4 h-4" />} label="Current password" value={currentPassword} onChange={setCurrentPassword} type="password" />
              <LabeledInput icon={<Lock className="w-4 h-4" />} label="New password" value={newPassword} onChange={setNewPassword} type="password" />
              <LabeledInput icon={<Lock className="w-4 h-4" />} label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} type="password" />
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Use at least 8 characters, including a number and a symbol.</div>
            <button disabled={!canChangePassword} className={`mt-4 px-4 py-2 rounded-lg text-white ${canChangePassword ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`}>Update password</button>
          </section>

          {/* Danger Zone */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-bold mb-4">Danger zone</h2>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Delete account</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">This action is irreversible. Your data will be permanently removed.</div>
              </div>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"><Trash2 className="w-4 h-4" /> Delete</button>
            </div>
          </section>
        </div>

        {/* Preferences & Sessions column */}
        <div className="space-y-6">
          {/* Preferences */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-bold mb-4">Preferences</h2>
            <div className="space-y-3">
              <LabeledSelect icon={<Globe2 className="w-4 h-4" />} label="Language" value={locale} onChange={setLocale} options={[{ v: 'en-GH', l: 'English (Ghana)' }, { v: 'en', l: 'English' }]} />
              <LabeledSelect icon={<Globe2 className="w-4 h-4" />} label="Currency" value={currency} onChange={setCurrency} options={[{ v: 'GHS', l: 'Ghanaian Cedi (GH₵)' }, { v: 'USD', l: 'US Dollar ($)' }]} />
              <div className="flex items-center justify-between">
                <div className="text-sm">Theme</div>
                <div className="flex gap-2">
                  {(['system','light','dark'] as const).map(t => (
                    <button key={t} onClick={() => setTheme(t)} className={`px-3 py-1.5 text-xs rounded-lg ${theme===t ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-bold mb-4">Notifications</h2>
            <ToggleRow icon={<Bell className="w-4 h-4" />} label="Email" value={emailNotif} onChange={setEmailNotif} />
            <ToggleRow icon={<Bell className="w-4 h-4" />} label="SMS" value={smsNotif} onChange={setSmsNotif} />
            <ToggleRow icon={<Bell className="w-4 h-4" />} label="Push" value={pushNotif} onChange={setPushNotif} />
          </section>

          {/* Two-factor & sessions */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
            <h2 className="text-lg font-bold mb-4">Security & sessions</h2>
            <ToggleRow icon={<Shield className="w-4 h-4" />} label="Two‑factor authentication (2FA)" value={twoFA} onChange={setTwoFA} />
            <div className="mt-4">
              <div className="text-sm font-semibold mb-2 flex items-center gap-2"><MonitorSmartphone className="w-4 h-4" /> Active sessions</div>
              <div className="space-y-2">
                {sessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{s.device} {s.current && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Current</span>}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{s.location} • {s.lastActive}</div>
                    </div>
                    <button className="text-xs px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-600">Log out</button>
                  </div>
                ))}
              </div>
              <button className="mt-3 inline-flex items-center gap-2 text-xs text-red-600"><LogOut className="w-4 h-4" /> Log out all sessions</button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

function LabeledInput({ icon, label, value, onChange, type = 'text' }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="text-sm">
      <span className="block mb-1 text-gray-600 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
        <span className="text-gray-500">{icon}</span>
        <input value={value} onChange={e => onChange(e.target.value)} type={type} className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white" />
      </div>
    </label>
  );
}

function LabeledSelect({ icon, label, value, onChange, options }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; options: Array<{ v: string; l: string }> }) {
  return (
    <label className="text-sm block">
      <span className="block mb-1 text-gray-600 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
        <span className="text-gray-500">{icon}</span>
        <select value={value} onChange={e => onChange(e.target.value)} className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white">
          {options.map(o => (
            <option key={o.v} value={o.v} className="bg-white dark:bg-gray-800">{o.l}</option>
          ))}
        </select>
      </div>
    </label>
  );
}

function ToggleRow({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">{icon}</span>
        <span>{label}</span>
      </div>
      <input type="checkbox" checked={value} onChange={() => onChange(!value)} />
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '');
}

export default Settings;

