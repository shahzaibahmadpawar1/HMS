import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit2, ChevronRight, LayoutGrid, List } from "lucide-react";
import * as motion from "framer-motion/client";

export const revalidate = 0;

export default async function PatientsPage() {
  const { data: patients } = await supabase
    .from('patients')
    .select('*, visits(id)')
    .order('created_at', { ascending: false });

  const totalPatients = patients?.length || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 flex flex-col relative z-10">
        
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Patients</h1>
            <p className="text-[13.5px] text-slate-500 font-medium">{totalPatients} registered patients in your directory</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex p-1 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl gap-0.5 shadow-sm">
              <button title="List" className="grid place-items-center w-[34px] h-[30px] rounded-[8px] bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-600/60 transition-all">
                <List className="w-4 h-4" />
              </button>
              <button title="Grid" className="grid place-items-center w-[34px] h-[30px] rounded-[8px] bg-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all">
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
            <Link href="/patient/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-4 rounded-[10px] text-[13px] font-semibold gap-1.5 shadow-sm">
                <Plus className="w-4 h-4" /> Add Patient
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="px-5 py-3.5 mb-5 bg-indigo-50/70 dark:bg-indigo-900/20 border border-indigo-100/50 dark:border-indigo-800/30 rounded-xl text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
          <strong className="text-slate-900 dark:text-white font-bold">This is a patient directory.</strong> All registered patients are shown here. Use the filters below to narrow by today’s OPD session or by clinic. Each patient keeps a single MRN and shared medical history across all your clinics.
        </motion.div>

        {/* Filters Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 mb-5 shadow-sm border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex gap-3 items-center flex-wrap">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                className="w-full pl-10 h-[42px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal" 
                placeholder="Search MRN / name / phone…" 
              />
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <button className="px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-[12.5px] font-bold transition-all shadow-sm">All</button>
              <button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[12.5px] font-semibold transition-all hover:bg-slate-100 shadow-sm">Today's Session</button>
              <button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[12.5px] font-semibold transition-all hover:bg-slate-100 shadow-sm">By Clinic</button>
            </div>
          </div>
        </motion.div>

        {/* Data Table Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-700/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-fixed min-w-[900px]">
              <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700/60">
                <tr>
                  <th className="w-[4%] px-4 py-3.5 text-center"><input type="checkbox" className="w-[15px] h-[15px] rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" /></th>
                  <th className="w-[24%] px-2 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Patient</th>
                  <th className="w-[12%] px-2 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">MRN</th>
                  <th className="w-[14%] px-2 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Age / Gender</th>
                  <th className="w-[10%] px-2 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Blood</th>
                  <th className="w-[18%] px-2 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Phone</th>
                  <th className="w-[12%] px-2 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Visits</th>
                  <th className="w-[6%] px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {patients && patients.map((patient) => {
                  const initials = patient.name.substring(0, 1).toUpperCase();
                  const visitsCount = patient.visits ? patient.visits.length : 0;
                  const ageGenderStr = `${patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() + ' yrs' : '—'} · ${patient.gender || '—'}`;
                  
                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer">
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" className="w-[15px] h-[15px] rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                            {initials}
                          </div>
                          <div className="font-semibold text-[13px] text-slate-900 dark:text-slate-100 uppercase tracking-wide truncate">
                            {patient.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <span className="font-mono text-[12px] font-semibold text-indigo-600 dark:text-indigo-400">{patient.patient_mrn || '—'}</span>
                      </td>
                      <td className="px-2 py-3 text-[13px] text-slate-600 dark:text-slate-300 capitalize truncate font-medium">
                        {ageGenderStr}
                      </td>
                      <td className="px-2 py-3">
                        {patient.blood_group ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold">{patient.blood_group}</span>
                        ) : (
                          <span className="text-slate-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="px-2 py-3 text-[13px] text-slate-600 dark:text-slate-300 truncate font-medium">
                        {patient.phone || '—'}
                      </td>
                      <td className="px-2 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                          {visitsCount} visits
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity">
                          <Link href={`/patient/${patient.id}/edit`} className="p-1 hover:text-indigo-600 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors" title="Edit patient details">
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <Link href={`/patient/${patient.id}`} className="hover:text-slate-600">
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {(!patients || patients.length === 0) && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 text-sm font-medium">
                      No patients found. Add a patient to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
