'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClinic } from '@/app/actions/clinics';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const clinicSchema = z.object({
  name: z.string().min(1, 'Clinic name is required'),
  phone: z.string().optional(),
  consult_fee: z.coerce.number().min(0).default(500),
  address: z.string().optional(),
  doctor_share: z.number().min(0).max(100).default(70),
});

type ClinicFormValues = z.infer<typeof clinicSchema>;

interface AddClinicDialogProps {
  trigger?: React.ReactNode;
}

export function AddClinicDialog({ trigger }: AddClinicDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: '',
      phone: '',
      consult_fee: 500,
      address: '',
      doctor_share: 70,
    }
  });

  const doctorShare = watch('doctor_share');

  const onSubmit = async (data: ClinicFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createClinic(data);
      if (result.success) {
        setOpen(false);
      } else {
        console.error('Failed to create clinic:', result.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-none shadow-2xl p-0 gap-0 overflow-hidden sm:max-w-lg">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">Add Clinic / Hospital</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 mt-1">
            Configure your OPD settings for this location
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Clinic / Hospital Name *</label>
              <Input 
                {...register('name')} 
                placeholder="e.g. City General Hospital" 
                className="bg-slate-100/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-11"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Phone</label>
                <Input 
                  {...register('phone')} 
                  placeholder="+92 21 0000000" 
                  className="bg-slate-100/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Default Consult Fee (Rs)</label>
                <Input 
                  type="number"
                  {...register('consult_fee')} 
                  className="bg-slate-100/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-11 focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Address</label>
              <Input 
                {...register('address')} 
                placeholder="Hospital address" 
                className="bg-slate-100/50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-11"
              />
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-4">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Revenue Split</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg p-3 text-center border border-emerald-100 dark:border-emerald-800/30">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{doctorShare}%</div>
                  <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">Your Share</div>
                </div>
                <div className="bg-slate-100/50 dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-200 dark:border-slate-800">
                  <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{100 - doctorShare}%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 font-medium">Hospital Share</div>
                </div>
              </div>

              <div className="pt-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={doctorShare} 
                  onChange={(e) => setValue('doctor_share', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-indigo-500 hover:bg-indigo-600 text-white border-0"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <span className="mr-2">+</span>}
              Add Clinic
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
