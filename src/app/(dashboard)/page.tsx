import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Banknote, Activity, Plus, FileBarChart, Gift } from "lucide-react";
import * as motion from "framer-motion/client";

export const revalidate = 0; // Disable caching for dashboard

export default async function Home() {
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  const totalPatientsCount = patients?.length || 0;

  // Let's get current date and time for the header
  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

  const currentHour = now.getHours();
  let greeting = "Good evening";
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 17) greeting = "Good afternoon";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 flex flex-col gap-6 relative z-10">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-[13px] text-slate-500 dark:text-slate-400 mb-1 font-medium">{greeting}</div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight uppercase">DOCTOR AMMAD</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="opacity-80">uol</span> 
            <span className="opacity-60">·</span> {dateString} <span className="opacity-60">·</span> {timeString}
          </p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-slate-700/60 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="text-[26px] font-bold text-slate-900 dark:text-white mb-1 tracking-tight">0</div>
            <div className="text-[12.5px] text-slate-500 dark:text-slate-400">Patients today</div>
            <div className="text-[11.5px] font-medium text-emerald-600 mt-2">+0 vs yesterday</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-slate-700/60 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="text-[26px] font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Rs 0</div>
            <div className="text-[12.5px] text-slate-500 dark:text-slate-400">Revenue today</div>
            <div className="text-[11.5px] font-medium text-slate-400 mt-2">Your share after split</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-slate-700/60 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="text-[26px] font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Rs 0</div>
            <div className="text-[12.5px] text-slate-500 dark:text-slate-400">Monthly revenue</div>
            <div className="text-[11.5px] font-medium text-emerald-600 mt-2">Net: Rs 0</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-slate-700/60 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-[26px] font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{totalPatientsCount}</div>
            <div className="text-[12.5px] text-slate-500 dark:text-slate-400">Total patients</div>
            <div className="text-[11.5px] font-medium text-slate-400 mt-2">All time registered</div>
          </motion.div>
        </div>



        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white dark:bg-slate-800 rounded-[1.25rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700/60">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/expenses?new=1">
              <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 gap-2 h-[38px] rounded-[10px] px-4 text-xs font-semibold shadow-sm">
                <Plus className="w-3.5 h-3.5 text-slate-500" /> Add Expense
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost" className="hover:bg-slate-50 dark:hover:bg-slate-700/50 gap-2 h-[38px] rounded-[10px] px-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <FileBarChart className="w-3.5 h-3.5 text-slate-400" /> View Reports
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Today's Queue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="mb-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center">
              Today's Queue 
              <span className="text-[12px] font-medium text-slate-400 ml-2">· uol</span>
            </div>
            <Link href="/patient/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 px-4 rounded-full text-xs font-semibold gap-1.5 shadow-sm transition-all hover:shadow-md">
                <Plus className="w-3.5 h-3.5" /> Add Patient
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
                <span className="text-[12.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Waiting</span>
                <span className="ml-auto text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">0</span>
              </div>
              <div className="p-3">
                <div className="text-[12.5px] font-medium text-slate-400 text-center py-5 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  No patients waiting
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
                <span className="text-[12.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">With Doctor</span>
                <span className="ml-auto text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">0</span>
              </div>
              <div className="p-3">
                <div className="text-[12.5px] font-medium text-slate-400 text-center py-5 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  No one with the doctor
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
                <span className="text-[12.5px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Completed</span>
                <span className="ml-auto text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">0</span>
              </div>
              <div className="p-3">
                <div className="text-[12.5px] font-medium text-slate-400 text-center py-5 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  Nothing completed yet
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
