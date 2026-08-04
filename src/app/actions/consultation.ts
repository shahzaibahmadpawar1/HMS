'use server';

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveVisit(visitData: any) {
  // 1. Insert into visits table
  const { data: visit, error: visitError } = await supabase
    .from('visits')
    .insert({
      patient_id: visitData.patient_id,
      temp: visitData.vitals.temp,
      bp: visitData.vitals.bp,
      pulse: visitData.vitals.pulse,
      respiratory_rate: visitData.vitals.rr,
      rbs: visitData.vitals.rbs,
      fbs: visitData.vitals.fbs,
      weight: visitData.vitals.weight,
      height: visitData.vitals.height,
      spo2: visitData.vitals.spo2,
      
      has_diabetes: visitData.checkboxes.diabetes,
      has_ihd_htn: visitData.checkboxes.htn,
      has_hepatitis: visitData.checkboxes.hepatitis,
      has_asthma: visitData.checkboxes.asthma,
      
      clinical_history: visitData.notes.clinical_history,
      physician_note: visitData.notes.physician_note,
      reports_findings: visitData.notes.reports_findings,
      
      status: 'completed'
    })
    .select('id')
    .single();

  if (visitError || !visit) {
    console.error('Failed to create visit:', visitError);
    return { error: 'Failed to create visit' };
  }

  const visitId = visit.id;

  // 2. Insert Complaints
  if (visitData.complaints && visitData.complaints.length > 0) {
    const complaintsToInsert = visitData.complaints.map((cId: string) => ({
      visit_id: visitId,
      complaint_id: cId
    }));
    await supabase.from('visit_complaints').insert(complaintsToInsert);
  }

  // 3. Insert Diagnoses
  if (visitData.diagnoses && visitData.diagnoses.length > 0) {
    const diagnosesToInsert = visitData.diagnoses.map((dId: string) => ({
      visit_id: visitId,
      diagnosis_id: dId
    }));
    await supabase.from('visit_diagnoses').insert(diagnosesToInsert);
  }

  // 4. Insert Medications
  if (visitData.medications && visitData.medications.length > 0) {
    const medsToInsert = visitData.medications.map((med: any) => ({
      visit_id: visitId,
      medicine_id: med.medicine_id,
      dose: med.dose,
      frequency: med.frequency,
      duration_days: med.duration_days
    }));
    await supabase.from('visit_medications').insert(medsToInsert);
  }

  revalidatePath('/'); // refresh dashboard list if needed
  
  // Return success so the client component can redirect
  return { success: true };
}
