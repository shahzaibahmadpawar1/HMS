'use server';

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addComplaint(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return;
  await supabase.from('master_complaints').insert({ name });
  revalidatePath('/master-data');
}

export async function deleteComplaint(formData: FormData) {
  const id = formData.get('id') as string;
  await supabase.from('master_complaints').delete().eq('id', id);
  revalidatePath('/master-data');
}

export async function addDiagnosis(formData: FormData) {
  const name = formData.get('name') as string;
  const icd10_code = formData.get('icd10_code') as string;
  if (!name) return;
  await supabase.from('master_diagnoses').insert({ name, icd10_code });
  revalidatePath('/master-data');
}

export async function deleteDiagnosis(formData: FormData) {
  const id = formData.get('id') as string;
  await supabase.from('master_diagnoses').delete().eq('id', id);
  revalidatePath('/master-data');
}

export async function addMedicine(formData: FormData) {
  const name = formData.get('name') as string;
  const brand = formData.get('brand') as string;
  if (!name) return;
  await supabase.from('master_medicines').insert({ name, brand });
  revalidatePath('/master-data');
}

export async function deleteMedicine(formData: FormData) {
  const id = formData.get('id') as string;
  await supabase.from('master_medicines').delete().eq('id', id);
  revalidatePath('/master-data');
}
