'use client';

import { useState } from 'react';
import { saveLetterhead, uploadFile } from '@/app/actions/settings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Upload } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function LetterheadTab({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Local state for preview
  const [preview, setPreview] = useState({
    clinicName: initialData.clinic_name || '',
    qualifications: initialData.qualifications || '',
    contact: initialData.clinic_contact || '',
    address: initialData.clinic_address || '',
    footer: initialData.footer_text || '',
    showMrn: initialData.show_mrn ?? true,
    showAge: initialData.show_patient_age ?? true,
    logoUrl: initialData.clinic_logo_url || null,
    signatureUrl: initialData.doctor_signature_url || null,
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);

  const handleUpload = async (file: File, type: 'logo' | 'signature') => {
    if (type === 'logo') setUploadingLogo(true);
    else setUploadingSig(true);

    const result = await uploadFile(file);
    if (result.success) {
      setPreview(p => ({ ...p, [type === 'logo' ? 'logoUrl' : 'signatureUrl']: result.url }));
    } else {
      alert("Upload failed: " + result.error);
    }

    if (type === 'logo') setUploadingLogo(false);
    else setUploadingSig(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    const formData = new FormData(e.currentTarget);
    formData.set('show_mrn', preview.showMrn.toString());
    formData.set('show_patient_age', preview.showAge.toString());
    
    if (preview.logoUrl) formData.set('clinic_logo_url', preview.logoUrl);
    if (preview.signatureUrl) formData.set('doctor_signature_url', preview.signatureUrl);

    const result = await saveLetterhead(formData);
    
    setIsSaving(false);
    if (result.success) {
      setMessage('Letterhead saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error saving letterhead: ' + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* PRESCRIPTION HEADER */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Prescription Header</h3>
        
        <div className="space-y-1.5">
          <label className="text-sm text-slate-600 dark:text-slate-400">Clinic / Hospital Name (on Rx)</label>
          <Input name="clinic_name" value={preview.clinicName} onChange={e => setPreview({...preview, clinicName: e.target.value})} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-600 dark:text-slate-400">Qualifications (shown under doctor name)</label>
          <Input name="qualifications" value={preview.qualifications} onChange={e => setPreview({...preview, qualifications: e.target.value})} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-600 dark:text-slate-400">Contact Number</label>
            <Input name="clinic_contact" value={preview.contact} onChange={e => setPreview({...preview, contact: e.target.value})} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-slate-600 dark:text-slate-400">Page Format</label>
            <select name="page_format" defaultValue={initialData.page_format || "A5 (Half page)"} className="w-full h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 rounded-md px-3 border text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="A5 (Half page)">A5 (Half page)</option>
              <option value="A4 (Full page)">A4 (Full page)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-600 dark:text-slate-400">Address</label>
          <Input name="clinic_address" value={preview.address} onChange={e => setPreview({...preview, address: e.target.value})} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-slate-600 dark:text-slate-400">Footer Text</label>
          <Input name="footer_text" value={preview.footer} onChange={e => setPreview({...preview, footer: e.target.value})} placeholder="e.g. OPD Hours: Mon-Sat 5pm-8pm" className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200" />
        </div>
      </div>

      {/* LOGO & SIGNATURE */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logo & Signature</h3>
          <p className="text-sm text-slate-400 mt-1">Logo prints at the top; signature prints above your name. PNG or JPG, max 5MB.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo */}
          <div className="space-y-2">
            <label className="text-sm text-slate-600 dark:text-slate-400">Clinic Logo</label>
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              {preview.logoUrl ? (
                <div className="mb-4 h-16 relative w-full flex justify-center">
                  <img src={preview.logoUrl} alt="Logo" className="max-h-full object-contain" />
                </div>
              ) : (
                <p className="text-sm text-slate-400 mb-4">None uploaded</p>
              )}
              <label className="cursor-pointer">
                <Button type="button" variant="outline" className="gap-2 pointer-events-none">
                  <Upload className="w-4 h-4" /> {uploadingLogo ? 'Uploading...' : 'Upload'}
                </Button>
                <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'logo')} />
              </label>
            </div>
          </div>

          {/* Signature */}
          <div className="space-y-2">
            <label className="text-sm text-slate-600 dark:text-slate-400">Doctor Signature</label>
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              {preview.signatureUrl ? (
                <div className="mb-4 h-16 relative w-full flex justify-center">
                  <img src={preview.signatureUrl} alt="Signature" className="max-h-full object-contain" />
                </div>
              ) : (
                <p className="text-sm text-slate-400 mb-4">None uploaded</p>
              )}
              <label className="cursor-pointer">
                <Button type="button" variant="outline" className="gap-2 pointer-events-none">
                  <Upload className="w-4 h-4" /> {uploadingSig ? 'Uploading...' : 'Upload'}
                </Button>
                <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0], 'signature')} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE MARGINS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Page Margins (MM)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5"><label className="text-sm text-slate-600">Top</label><Input name="margin_top" type="number" defaultValue={initialData.margin_top || 20} className="h-11" /></div>
          <div className="space-y-1.5"><label className="text-sm text-slate-600">Bottom</label><Input name="margin_bottom" type="number" defaultValue={initialData.margin_bottom || 20} className="h-11" /></div>
          <div className="space-y-1.5"><label className="text-sm text-slate-600">Left</label><Input name="margin_left" type="number" defaultValue={initialData.margin_left || 20} className="h-11" /></div>
          <div className="space-y-1.5"><label className="text-sm text-slate-600">Right</label><Input name="margin_right" type="number" defaultValue={initialData.margin_right || 20} className="h-11" /></div>
        </div>
      </div>

      {/* DISPLAY OPTIONS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Display Options</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="mrn" checked={preview.showMrn} onCheckedChange={(c) => setPreview({...preview, showMrn: c as boolean})} />
            <label htmlFor="mrn" className="text-sm cursor-pointer select-none">Show MRN on prescription</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="age" checked={preview.showAge} onCheckedChange={(c) => setPreview({...preview, showAge: c as boolean})} />
            <label htmlFor="age" className="text-sm cursor-pointer select-none">Show patient age</label>
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Preview</h3>
        <div className="border border-slate-300 p-8 rounded-lg bg-white text-slate-900 shadow-inner overflow-x-auto min-h-[400px]">
          
          {/* Mock Letterhead Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-4">
              {preview.logoUrl && <img src={preview.logoUrl} alt="Logo" className="h-16 w-16 object-contain" />}
              <div>
                <h1 className="text-2xl font-bold uppercase">{preview.clinicName || 'Clinic Name'}</h1>
                <p className="text-sm text-slate-600">{preview.address || 'Clinic Address'}</p>
                <p className="text-sm text-slate-600">{preview.contact || 'Contact Number'}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-bold">{initialData.full_name || 'DOCTOR AMMAD'}</h2>
              <p className="text-sm font-semibold">{preview.qualifications || 'Qualifications'}</p>
            </div>
          </div>

          {/* Mock Patient Info Line */}
          <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-4 text-xs font-semibold">
            <span>Patient: Sample Patient</span>
            {preview.showMrn && <span>MRN: P-00001</span>}
            {preview.showAge && <span>Age: 32 yrs</span>}
            <span>Gender: Male</span>
            <span>Date: 15-Aug-2026</span>
          </div>

          {/* Mock Rx Content */}
          <div className="grid grid-cols-3 gap-6 min-h-[200px]">
            <div className="col-span-1 border-r border-slate-200 pr-4">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">History</h4>
              <p className="text-sm text-slate-700">Lower back pain from 3 months</p>
            </div>
            <div className="col-span-2 space-y-4">
              <div className="text-3xl font-serif font-black text-indigo-900">Rx</div>
              <div className="bg-slate-100 p-2 rounded text-sm text-slate-800 font-medium">Dx: Low back pain</div>
              <div>
                <p className="font-bold">1. Paracetamol (500mg)</p>
                <p className="text-sm text-slate-600">Oral · TDS · 5 days · After meals</p>
              </div>
            </div>
          </div>

          {/* Mock Footer */}
          <div className="mt-8 border-t border-slate-300 pt-4 flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500">Follow-up:</span> <span className="text-sm">7 days</span>
              <p className="text-xs text-slate-500 mt-2">{preview.footer}</p>
            </div>
            <div className="flex flex-col items-center">
              {preview.signatureUrl ? (
                <img src={preview.signatureUrl} alt="Signature" className="h-12 object-contain mb-1" />
              ) : (
                <div className="h-12 w-24 mb-1"></div>
              )}
              <span className="font-bold border-t border-slate-900 pt-1 uppercase text-sm">{initialData.full_name || 'DOCTOR AMMAD'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end sticky bottom-6 z-10 bg-slate-50/80 dark:bg-slate-900/80 p-4 rounded-xl backdrop-blur-md border border-slate-200/50">
        <div className="flex items-center gap-4">
          {message && <span className="text-sm text-emerald-600 font-medium">{message}</span>}
          <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 w-full sm:w-auto h-11 px-8 rounded-lg">
            <Check className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Letterhead'}
          </Button>
        </div>
      </div>
    </form>
  );
}
