'use server';

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getClinics() {
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch clinics:', error);
    return [];
  }
  return data || [];
}

export async function createClinic(clinicData: any) {
  // Let's get the current user session
  const { data: { user } } = await supabase.auth.getUser();
  
  const payload = {
    ...clinicData,
  };
  
  if (user) {
    payload.user_id = user.id;
  }

  const { data, error } = await supabase
    .from('clinics')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Failed to create clinic:', error);
    return { error: error.message };
  }

  revalidatePath('/clinics');
  return { success: true, data };
}

export async function deleteClinic(id: string) {
  const { error } = await supabase
    .from('clinics')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete clinic:', error);
    return { error: error.message };
  }

  revalidatePath('/clinics');
  return { success: true };
}
