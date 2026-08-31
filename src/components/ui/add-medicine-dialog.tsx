'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Pill, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SearchableSelect } from './searchable-select';

export function AddMedicineDialog({ 
  open, 
  onOpenChange,
  masterMedicines,
  onAdd,
  medicineCount
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  masterMedicines: any[],
  onAdd: (med: any) => void,
  medicineCount: number
}) {
  const [medicineId, setMedicineId] = useState("");
  const [dose, setDose] = useState("");
  const [route, setRoute] = useState("");
  const [frequency, setFrequency] = useState("");
  const [instructions, setInstructions] = useState("");
  const [duration, setDuration] = useState("");

  const resetForm = () => {
    setMedicineId("");
    setDose("");
    setRoute("");
    setFrequency("");
    setInstructions("");
    setDuration("");
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleAdd = (closeAfter: boolean) => {
    if (!medicineId) return;
    
    const medName = masterMedicines.find(m => m.id === medicineId)?.name || 'Unknown';
    
    onAdd({
      id: medicineId,
      name: medName,
      dose: dose || '-',
      route: route || '-',
      frequency: frequency || '-',
      instructions: instructions || '-',
      duration: duration || '-'
    });
    
    if (closeAfter) {
      onOpenChange(false);
    } else {
      resetForm();
      // focus back to first input conceptually
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden outline-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[starting-style]:scale-95 transition-all duration-200">
          
          {/* Header */}
          <div className="p-6 pb-4 flex items-start justify-between bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 relative">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  Add Medicine 
                  <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-xs py-0.5 px-2.5 rounded-full font-bold">
                    #{medicineCount}
                  </span>
                </Dialog.Title>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Type each field, hit Enter to advance. Press Enter on Duration to add and start the next.
                </p>
              </div>
            </div>
            <Dialog.Close className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-6 space-y-8 bg-slate-50/50 dark:bg-slate-900 overflow-y-auto max-h-[60vh]">
            
            {/* Section 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-400 uppercase">
                <Pill className="w-3.5 h-3.5" /> What
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Medicine name *</label>
                  <SearchableSelect 
                    options={masterMedicines.map(m => ({ value: m.id, label: `${m.name}${m.brand ? ` (${m.brand})` : ''}` }))} 
                    value={medicineId} 
                    onChange={val => setMedicineId(val)} 
                    placeholder="Start typing — e.g. Panadol Extra" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Dose</label>
                  <input 
                    type="text"
                    value={dose}
                    onChange={e => setDose(e.target.value)}
                    placeholder="e.g. 500 mg"
                    className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm outline-none border"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-400 uppercase">
                <Pill className="w-3.5 h-3.5" /> How to administer
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Route</label>
                  <input 
                    type="text"
                    value={route}
                    onChange={e => setRoute(e.target.value)}
                    placeholder="e.g. Oral"
                    className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm outline-none border"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Frequency</label>
                  <input 
                    type="text"
                    value={frequency}
                    onChange={e => setFrequency(e.target.value)}
                    placeholder="e.g. TDS"
                    className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm outline-none border"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Instructions</label>
                  <input 
                    type="text"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder="e.g. After meals"
                    className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm outline-none border"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-400 uppercase">
                <Pill className="w-3.5 h-3.5" /> For how long
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Duration</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAdd(false);
                      }
                    }}
                    placeholder="e.g. 5 days"
                    className="w-full h-14 pl-4 pr-32 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-base outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => handleAdd(false)}
                    className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    Enter <span className="text-slate-400 font-normal hidden sm:inline">to add & continue</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5"><kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">Tab</kbd> next field</div>
              <div className="flex items-center gap-1.5"><kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">Esc</kbd> close</div>
            </div>
            
            <div className="flex gap-3 items-center">
              <Dialog.Close className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border border-transparent">
                Cancel
              </Dialog.Close>
              <button 
                type="button"
                onClick={() => handleAdd(true)}
                className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <CornerDownLeft className="w-4 h-4" /> Add & close
              </button>
            </div>
          </div>

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
