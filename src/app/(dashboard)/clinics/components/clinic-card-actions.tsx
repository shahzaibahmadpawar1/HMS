'use client';

import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddClinicDialog } from './add-clinic-dialog';
import { deleteClinic } from '@/app/actions/clinics';
import { useState } from 'react';

export function ClinicCardActions({ clinic }: { clinic: any }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this clinic? This cannot be undone.')) {
      setIsDeleting(true);
      await deleteClinic(clinic.id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
      <AddClinicDialog 
        clinic={clinic}
        trigger={
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 px-3">
            <Edit className="w-4 h-4 mr-1.5" /> Edit
          </Button>
        }
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 h-9 px-3"
      >
        <Trash2 className="w-4 h-4 mr-1.5" /> Delete
      </Button>
    </div>
  );
}
