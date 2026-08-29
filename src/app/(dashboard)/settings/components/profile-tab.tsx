'use client';

import { useState } from 'react';
import { saveProfile } from '@/app/actions/settings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function ProfileTab({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    const formData = new FormData(e.currentTarget);
    const result = await saveProfile(formData);
    
    setIsSaving(false);
    if (result.success) {
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error saving profile: ' + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Information */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Personal Information</h3>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-600 dark:text-slate-400">Full Name</label>
            <Input name="full_name" defaultValue={initialData.full_name || ''} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm text-slate-600 dark:text-slate-400">Email (read only)</label>
            <Input name="email" defaultValue={initialData.email || ''} readOnly className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 opacity-70" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-600 dark:text-slate-400">Phone</label>
            <Input name="phone" defaultValue={initialData.phone || ''} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-600 dark:text-slate-400">CNIC</label>
            <Input name="cnic" defaultValue={initialData.cnic || ''} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-600 dark:text-slate-400">Address</label>
            <Input name="address" defaultValue={initialData.address || ''} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
          </div>
        </div>
      </div>

      {/* Professional & Tax */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Professional & Tax</h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-slate-600 dark:text-slate-400">PMDC License No.</label>
              <Input name="pmdc_number" defaultValue={initialData.pmdc_number || ''} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm text-slate-600 dark:text-slate-400">NTN (FBR)</label>
              <Input name="ntn_number" defaultValue={initialData.ntn_number || ''} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-end gap-2">
          {message && <span className="text-sm text-emerald-600 font-medium">{message}</span>}
          <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 w-full sm:w-auto h-11 px-8 rounded-lg">
            <Check className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </form>
  );
}
