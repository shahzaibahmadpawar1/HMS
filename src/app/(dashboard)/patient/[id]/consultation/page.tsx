import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ConsultationForm } from "@/components/consultation-form";
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
    { data: masterMedicines },
    { data: masterServices }
  ] = await Promise.all([
    supabase.from('master_complaints').select('*').order('name'),
    supabase.from('master_diagnoses').select('*').order('name'),
    supabase.from('master_medicines').select('*').order('name'),
    supabase.from('master_services').select('*').order('name')
  ]);

  // 3. Fetch previous visit data if copyFrom is provided
  let initialVisitData = null;
  if (copyFromId) {
    initialVisitData = await getFullVisitDetails(copyFromId);
  }

  return (
    <ConsultationForm 
      patient={patient} 
      masterComplaints={masterComplaints || []}
      masterDiagnoses={masterDiagnoses || []}
      masterMedicines={masterMedicines || []}
      masterServices={masterServices || []}
      initialVisitData={initialVisitData}
    />
  );
}
