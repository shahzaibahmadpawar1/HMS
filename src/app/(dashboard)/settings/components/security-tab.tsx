'use client';

import { useState } from 'react';
import { updateCredentials } from '@/app/actions/settings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function SecurityTab({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const newPass = formData.get('newPassword') as string;
    const confirmPass = formData.get('confirmPassword') as string;
    const currentPass = formData.get('currentPassword') as string;

    if (!currentPass) {
      setError('Please enter your current password to make changes.');
      return;
    }

    if (newPass && newPass !== confirmPass) {
      setError('New passwords do not match.');
      return;
    }

    if (newPass && newPass.length > 0 && newPass.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    setIsSaving(true);
    setMessage('');
    setError('');
    
    const result = await updateCredentials(formData);
    
    setIsSaving(false);
    if (result.success) {
      setMessage('Security credentials updated successfully!');
      (e.target as HTMLFormElement).reset(); // clear passwords
      setTimeout(() => setMessage(''), 3000);
    } else {
      setError('Error: ' + result.error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Change Credentials</h2>
        <p className="text-slate-500 max-w-2xl text-sm">
          Update your login username and password. You will remain logged in on this device.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {/* Username Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Username</label>
          <Input 
            name="username" 
            defaultValue={initialData?.username || ''} 
            className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" 
            placeholder="Your login username"
          />
        </div>

        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Current Password</label>
          <Input 
            name="currentPassword" 
            type="password" 
            className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" 
            placeholder="Your current password" 
            required 
          />
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">New Password</label>
          <Input 
            name="newPassword" 
            type="password" 
            className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" 
            placeholder="Min. 8 characters" 
          />
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Confirm New Password</label>
          <Input 
            name="confirmPassword" 
            type="password" 
            className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" 
            placeholder="Re-enter new password" 
          />
        </div>

        <div className="pt-2 flex items-center gap-4">
          <Button type="submit" disabled={isSaving} className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2 px-6 h-10 rounded-lg">
            <Check className="h-4 w-4" /> {isSaving ? 'Updating...' : 'Update Credentials'}
          </Button>
          {message && <span className="text-sm text-emerald-600 font-medium">{message}</span>}
          {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
        </div>
      </form>

      {/* Sessions info */}
      <div className="pt-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Where You're Signed In</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-2xl">
          Every device currently signed in to your practice, including your staff. If you see somewhere you don't recognise, change your password.
        </p>

        <div className="max-w-3xl bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
          <p className="text-sm font-semibold text-emerald-900">You (doctor) <span className="text-emerald-600 text-xs uppercase tracking-wider ml-2">This Device</span></p>
          <p className="text-xs text-emerald-700/70 mt-1">Current Session • Signed In Recently</p>
        </div>
      </div>
    </div>
  );
}
