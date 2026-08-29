'use server';

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Helper to get the doctor's user id since auth isn't fully implemented
async function getDoctorUserId() {
  const { data } = await supabase.from('users').select('id').eq('username', 'doctor').single();
  return data?.id;
}

export async function getDoctorSettings() {
  const userId = await getDoctorUserId();
  if (!userId) return null;

  const { data: settings } = await supabase
    .from('doctor_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  const { data: user } = await supabase
    .from('users')
    .select('username')
    .eq('id', userId)
    .single();

  return { ...settings, username: user?.username };
}

export async function saveProfile(formData: FormData) {
  const userId = await getDoctorUserId();
  if (!userId) return { success: false, error: "User not found" };

  const updates = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    cnic: formData.get('cnic'),
    address: formData.get('address'),
    pmdc_number: formData.get('pmdc_number'),
    ntn_number: formData.get('ntn_number'),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('doctor_settings')
    .update(updates)
    .eq('user_id', userId);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  revalidatePath('/settings');
  return { success: true };
}

export async function saveLetterhead(formData: FormData) {
  const userId = await getDoctorUserId();
  if (!userId) return { success: false, error: "User not found" };

  const updates = {
    clinic_name: formData.get('clinic_name'),
    qualifications: formData.get('qualifications'),
    clinic_contact: formData.get('clinic_contact'),
    page_format: formData.get('page_format'),
    clinic_address: formData.get('clinic_address'),
    footer_text: formData.get('footer_text'),
    margin_top: parseInt(formData.get('margin_top') as string || '20', 10),
    margin_bottom: parseInt(formData.get('margin_bottom') as string || '20', 10),
    margin_left: parseInt(formData.get('margin_left') as string || '20', 10),
    margin_right: parseInt(formData.get('margin_right') as string || '20', 10),
    show_mrn: formData.get('show_mrn') === 'true',
    show_patient_age: formData.get('show_patient_age') === 'true',
    updated_at: new Date().toISOString(),
    // Preserve existing URLs if not updated in this form data directly
  };
  
  // Conditionally add URLs if they are present in FormData
  const logoUrl = formData.get('clinic_logo_url');
  if (logoUrl) (updates as any).clinic_logo_url = logoUrl;
  
  const signatureUrl = formData.get('doctor_signature_url');
  if (signatureUrl) (updates as any).doctor_signature_url = signatureUrl;

  const { error } = await supabase
    .from('doctor_settings')
    .update(updates)
    .eq('user_id', userId);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  revalidatePath('/settings');
  return { success: true };
}

export async function saveDesign(design: string) {
  const userId = await getDoctorUserId();
  if (!userId) return { success: false, error: "User not found" };

  const { error } = await supabase
    .from('doctor_settings')
    .update({ active_design: design, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  revalidatePath('/settings');
  return { success: true };
}

export async function uploadFile(file: File) {
  if (!file) return { success: false, error: "No file provided" };
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
  
  const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(filePath);

  return { success: true, url: publicUrl };
}

export async function updateCredentials(formData: FormData) {
  const userId = await getDoctorUserId();
  if (!userId) return { success: false, error: "User not found" };

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const newUsername = formData.get('username') as string;

  // First verify the current password
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('password_plain')
    .eq('id', userId)
    .single();

  if (userError || !user) return { success: false, error: "Could not verify user" };
  
  if (currentPassword !== user.password_plain) {
    return { success: false, error: "Current password is incorrect" };
  }

  // Update credentials
  const updates: any = {};
  if (newPassword && newPassword.trim() !== '') {
    updates.password_plain = newPassword;
  }
  if (newUsername && newUsername.trim() !== '') {
    updates.username = newUsername;
  }

  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }
  }

  revalidatePath('/settings');
  return { success: true };
}
