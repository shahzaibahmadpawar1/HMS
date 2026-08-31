import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import * as motion from "framer-motion/client";

export const revalidate = 0; // Disable caching for dashboard

export default async function Home() {
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen flex flex-col">


      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 flex flex-col gap-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Patients Directory</h2>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-1.5">Manage your patients and start new consultations.</p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input type="search" placeholder="Search patients..." className="pl-10 h-11 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500 focus-visible:ring-offset-0 transition-all" />
            </div>
            <Link href="/patient/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 w-full sm:w-auto h-11 rounded-full px-6 premium-shadow-hover active:scale-95 transition-all">
                <UserPlus className="h-4 w-4" /> Add Patient
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Patients Grid/List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-700/60">
                <tr>
                  <th className="px-6 py-5 font-semibold tracking-wider">MRN</th>
                  <th className="px-6 py-5 font-semibold tracking-wider">Patient Name</th>
                  <th className="px-6 py-5 font-semibold tracking-wider">Age / DOB</th>
                  <th className="px-6 py-5 font-semibold tracking-wider">Gender</th>
                  <th className="px-6 py-5 font-semibold tracking-wider">Phone</th>
                  <th className="px-6 py-5 font-semibold text-right tracking-wider">Actions</th>
                </tr>
              </thead>
              <motion.tbody
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                  hidden: {},
                }}
              >
                {!patients || patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center gap-3"
                      >
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                          <UserPlus className="h-10 w-10 text-slate-400" />
                        </div>
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No patients found.</p>
                        <p className="text-sm">Add a new patient to get started.</p>
                      </motion.div>
                    </td>
                  </tr>
                ) : (
                  patients.map((patient, index) => (
                    <motion.tr 
                      key={patient.id} 
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                      }}
                      className="border-b border-slate-100/50 dark:border-slate-700/30 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="px-6 py-5 font-medium text-slate-900 dark:text-slate-100">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs tracking-wide">
                          {patient.patient_mrn || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                            {patient.name.charAt(0).toUpperCase()}
                          </div>
                          {patient.name}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                        {patient.dob ? new Date(patient.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                      </td>
                      <td className="px-6 py-5 text-slate-600 dark:text-slate-300 capitalize">
                        {patient.gender || '-'}
                      </td>
                      <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                        {patient.phone || '-'}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Link href={`/patient/${patient.id}/edit`}>
                            <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-full transition-all px-4">
                              Edit
                            </Button>
                          </Link>
                          <Link href={`/patient/${patient.id}`}>
                            <Button variant="outline" size="sm" className="gap-2 rounded-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all px-4">
                              <FileText className="h-4 w-4" /> Patient Profile
                            </Button>
                          </Link>
                          <Link href={`/patient/${patient.id}/consultation`}>
                            <Button size="sm" className="gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white premium-shadow-hover transition-all px-4">
                              <UserPlus className="h-4 w-4" /> Visit
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </table>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
