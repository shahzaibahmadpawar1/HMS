'use server';

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';

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
  // Let's get the current user session from cookies
  const cookieStore = await cookies();
  const sessionStr = cookieStore.get('hms_session')?.value;
  let user_id = null;
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      user_id = session.userId;
    } catch (e) {
      console.error(e);
    }
  }
  
  const payload = {
    ...clinicData,
  };
  
  if (user_id) {
    payload.user_id = user_id;
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

export async function updateClinic(id: string, clinicData: any) {
  const { data, error } = await supabase
    .from('clinics')
    .update(clinicData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update clinic:', error);
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
