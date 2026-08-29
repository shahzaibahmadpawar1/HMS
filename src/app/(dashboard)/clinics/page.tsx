import { getClinics } from '@/app/actions/clinics';
import { AddClinicDialog } from './components/add-clinic-dialog';
import { Building, Building2, Trash2, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic'; // Ensure we fetch fresh data

export default async function ClinicsPage() {
  const clinics = await getClinics();

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
            My Clinics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your OPD locations and revenue splits</p>
        </div>
        <AddClinicDialog 
          trigger={
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-sm shadow-indigo-500/20">
              <span className="mr-2">+</span> Add Clinic
            </Button>
          } 
        />
      </div>

      {clinics.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center min-h-[400px]">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No clinics found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mb-6">
            You haven't added any clinics or hospitals yet. Click the button above to add your first location.
          </p>
          <AddClinicDialog 
            trigger={
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white border-0">
                <span className="mr-2">+</span> Add Clinic
              </Button>
            } 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clinics.map((clinic: any) => (
            <div key={clinic.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                  <Building className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg truncate">{clinic.name}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 space-y-0.5 mt-1">
                    {clinic.address && <p className="truncate">{clinic.address}</p>}
                    {clinic.phone && <p>{clinic.phone}</p>}
                  </div>
                </div>

                <div className="flex gap-3 text-center ml-2">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg shrink-0">
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg leading-none">{clinic.doctor_share}%</div>
                    <div className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 font-medium uppercase tracking-wider mt-1">Your Share</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg shrink-0">
                    <div className="text-slate-700 dark:text-slate-200 font-bold text-lg leading-none">Rs {clinic.consult_fee}</div>
                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Consult Fee</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 px-3">
                  <Edit className="w-4 h-4 mr-1.5" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 h-9 px-3">
                  <LogOut className="w-4 h-4 mr-1.5" /> Leave
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 h-9 px-3">
                  <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
