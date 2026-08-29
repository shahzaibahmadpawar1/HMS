import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ConsultationForm } from "@/components/consultation-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getFullVisitDetails } from "@/app/actions/consultation";

export default async function PatientConsultation({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ copyFrom?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const patientId = resolvedParams.id;
  const copyFromId = resolvedSearchParams.copyFrom;

  // 1. Fetch Patient Details
  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single();

  if (error || !patient) {
    return notFound();
  }

  // 2. Fetch Master Data for dropdowns
  const [
    { data: masterComplaints },
    { data: masterDiagnoses },
    { data: masterMedicines }
  ] = await Promise.all([
    supabase.from('master_complaints').select('*').order('name'),
    supabase.from('master_diagnoses').select('*').order('name'),
    supabase.from('master_medicines').select('*').order('name')
  ]);

  // 3. Fetch previous visit data if copyFrom is provided
  let initialVisitData = null;
  if (copyFromId) {
    initialVisitData = await getFullVisitDetails(copyFromId);
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Top Header */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center z-20 print:hidden">
        <div className="flex items-center gap-4">
          <Link href={`/patient/${patientId}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-800 text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="font-bold text-lg tracking-wide uppercase">{patient.name}</h2>
            <div className="text-xs text-slate-400 font-medium">
              MRN: {patient.patient_mrn} | {patient.dob ? patient.dob : patient.age_dob} / {patient.gender}
            </div>
          </div>
        </div>
      </header>

      {/* Main Interactive Form Component */}
      <ConsultationForm 
        patient={patient} 
        masterComplaints={masterComplaints || []}
        masterDiagnoses={masterDiagnoses || []}
        masterMedicines={masterMedicines || []}
        initialVisitData={initialVisitData}
      />
    </div>
  );
}
