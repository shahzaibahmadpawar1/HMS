import { supabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, History, CalendarDays, FileText, ChevronRight } from "lucide-react";
import { getPatientVisits } from "@/app/actions/consultation";
import * as motion from "framer-motion/client";

export const revalidate = 0;

export default async function PatientProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const patientId = resolvedParams.id;

  // 1. Fetch Patient Details
  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single();

  if (error || !patient) {
    return notFound();
  }

  // 2. Fetch past visits
  const visits = await getPatientVisits(patientId);

  // If there are no past visits, optionally redirect directly to new consultation?
  // Let's keep it here so they can see patient details, but they can click "Start First Visit".

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Top Header */}
      <header className="glass-header p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="font-bold text-xl tracking-wide uppercase text-slate-800 dark:text-white">{patient.name}</h2>
            <div className="text-sm text-slate-500 font-medium">
              MRN: <span className="font-semibold text-slate-700 dark:text-slate-300">{patient.patient_mrn}</span> | {patient.dob ? new Date(patient.dob).toLocaleDateString() : patient.age_dob} | {patient.gender}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href={`/patient/${patientId}/edit`}>
            <Button variant="outline" className="rounded-full">
              Edit Patient
            </Button>
          </Link>
          <Link href={`/patient/${patientId}/consultation`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full gap-2 premium-shadow-hover">
              <Plus className="h-4 w-4" /> Start New Visit
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 lg:p-8 flex flex-col gap-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-200/60 dark:border-slate-700/50"
        >
          <div>
            <h3 className="text-xl font-bold mb-1">Patient History</h3>
            <p className="text-slate-500 text-sm">Review past consultations and start follow-ups.</p>
          </div>
          
          {visits.length > 0 && (
            <Link href={`/patient/${patientId}/consultation?copyFrom=${visits[0].id}`}>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-full gap-2 px-6 shadow-md shadow-amber-500/20 active:scale-95 transition-all">
                <History className="h-4 w-4" /> Follow Up (Copy from Last Visit)
              </Button>
            </Link>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-emerald-500" /> Past Consultations
          </h4>

          {visits.length === 0 ? (
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-12 text-center border border-slate-200/50 dark:border-slate-700/50">
              <div className="bg-slate-100 dark:bg-slate-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Past Visits</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">This patient does not have any recorded consultations yet.</p>
              <Link href={`/patient/${patientId}/consultation`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full gap-2">
                  <Plus className="h-4 w-4" /> Start First Visit
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map((visit, index) => (
                <div key={visit.id} className="glass-panel p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-md">
                        {new Date(visit.visit_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      {index === 0 && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Latest</span>}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>Doctor:</strong> {visit.doctor?.username || 'Unknown'} | 
                      <strong> Status:</strong> {visit.status}
                    </div>
                    {(visit.clinical_history || visit.physician_note) && (
                      <div className="text-sm text-slate-500 mt-2 line-clamp-1 italic">
                        "{visit.physician_note || visit.clinical_history}"
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Link href={`/patient/${patientId}/consultation?copyFrom=${visit.id}`} className="w-full md:w-auto">
                      <Button variant="outline" className="w-full md:w-auto rounded-full gap-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50">
                        <History className="h-4 w-4" /> Copy
                      </Button>
                    </Link>
                    {/* View Details could be added later if needed */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
