'use client';

import { useState } from 'react';
import { saveDesign } from '@/app/actions/settings';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DesignTab({ initialData }: { initialData: any }) {
  const [activeDesign, setActiveDesign] = useState(initialData.active_design || 'Clinical');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const designs = [
    {
      id: 'Classic',
      name: 'Classic',
      desc: 'The design OPDPRO prints today — copper tones, explicit labels, traditional header.',
      color: 'bg-orange-50'
    },
    {
      id: 'Minimal',
      name: 'Minimal',
      desc: 'Your name and degrees top right, logo and details small top left. Clean, no lines.',
      color: 'bg-slate-50'
    },
    {
      id: 'Clinical',
      name: 'Clinical',
      desc: 'Built for volume. Tighter type fits roughly 1.5x the medicines onto A5. Ideal for hospitals.',
      color: 'bg-blue-50'
    },
    {
      id: 'Traditional',
      name: 'Traditional',
      desc: 'The printed pad, centred serif name over a double rule. Header spans the page width.',
      color: 'bg-stone-50'
    },
    {
      id: 'Modern',
      name: 'Modern',
      desc: 'Your name leads, clinic name beside it, one neat rule under. Emerald green Rx.',
      color: 'bg-emerald-50'
    }
  ];

  const handleSelect = async (designId: string) => {
    setActiveDesign(designId);
    setIsSaving(true);
    setMessage('');

    const result = await saveDesign(designId);
    
    setIsSaving(false);
    if (result.success) {
      setMessage('Design updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error updating design: ' + result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Prescription design</h2>
        <p className="text-slate-500 max-w-2xl text-sm">
          Every design below is your own prescription — your clinic name, logo and signature, drawn by the same code that prints it. Pick one and new prescriptions print that way. Prescriptions you have already given out are unchanged.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-4 h-6">
        {message && <span className="text-sm text-emerald-600 font-medium">{message}</span>}
        {isSaving && <span className="text-sm text-slate-500">Saving...</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {designs.map(design => {
          const isSelected = activeDesign === design.id;
          
          return (
            <div 
              key={design.id}
              onClick={() => handleSelect(design.id)}
              className={cn(
                "cursor-pointer rounded-xl overflow-hidden transition-all duration-200 border-2 flex flex-col h-full",
                isSelected 
                  ? "border-indigo-600 shadow-md ring-4 ring-indigo-600/10" 
                  : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
              )}
            >
              {/* Mock Design Thumbnail */}
              <div className={cn("h-64 p-4 border-b border-slate-100 flex flex-col relative", design.color)}>
                <div className="text-[8px] flex justify-between items-start opacity-70">
                  <div className="font-bold">CLINIC NAME</div>
                  <div className="text-right">DOCTOR NAME<br/>Qualifications</div>
                </div>
                <div className="mt-4 border-t border-slate-300 pt-1 text-[6px]">
                  Patient Name <span className="ml-4">Age: 30</span>
                </div>
                <div className="mt-4 text-xl font-serif text-indigo-900 opacity-50">Rx</div>
                <div className="mt-1 space-y-2">
                  <div className="h-1.5 w-3/4 bg-slate-300 rounded"></div>
                  <div className="h-1.5 w-1/2 bg-slate-300 rounded"></div>
                </div>
                
                {isSelected && (
                  <div className="absolute inset-0 bg-indigo-600/5 flex items-center justify-center">
                    <div className="bg-indigo-600 text-white rounded-full p-2 shadow-lg">
                      <Check className="w-6 h-6" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className={cn(
                "p-4 flex-1 flex flex-col",
                isSelected ? "bg-indigo-50/50" : "bg-white dark:bg-slate-800"
              )}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{design.name}</h3>
                  {isSelected && <span className="text-xs font-bold text-indigo-600 flex items-center gap-1"><Check className="w-3 h-3"/> In use</span>}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{design.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
