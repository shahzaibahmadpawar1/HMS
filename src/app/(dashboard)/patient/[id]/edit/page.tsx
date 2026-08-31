import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PhoneInput } from "@/components/ui/phone-input";
import { CnicInput } from "@/components/ui/cnic-input";

export default async function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const patientId = resolvedParams.id;

  // Fetch existing patient details
  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single();

  if (error || !patient) {
    return notFound();
  }

  // Server action to update patient
  async function updatePatient(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;
    const dob = formData.get('dob') as string;
    const gender = formData.get('gender') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;

    const email = formData.get('email') as string;
    const cnic = formData.get('cnic') as string;
    const blood_group = formData.get('blood_group') as string;
    const allergies = formData.get('allergies') as string;
    const notes = formData.get('notes') as string;

    const { error } = await supabase
      .from('patients')
      .update({
        name,
        dob: dob || null,
        gender,
        phone,
        address,
        email,
        cnic,
        blood_group,
        allergies,
        notes
      })
      .eq('id', patientId);

    if (error) {
      console.error(error);
      redirect(`/patient/${patientId}/edit?error=failed`);
    }

    // Redirect to dashboard (or consultation page) after saving
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Patient Record</h1>
            <p className="text-sm text-slate-500">Update details for {patient.name.toUpperCase()} ({patient.patient_mrn})</p>
          </div>
        </div>

        <form action={updatePatient} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name *</label>
              <Input name="name" defaultValue={patient.name} required placeholder="John Doe" />
            </div>
            <div className="space-y-2 flex flex-col justify-end pb-2">
              <span className="text-sm text-slate-500 font-medium">
                MRN: {patient.patient_mrn} (Cannot be changed)
              </span>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date of Birth</label>
              <Input name="dob" defaultValue={patient.dob || ''} type="date" max={new Date().toISOString().split('T')[0]} required className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
              <select name="gender" defaultValue={patient.gender} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent dark:border-slate-700 dark:text-slate-50">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
              <PhoneInput name="phone" defaultValue={patient.phone || ''} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">CNIC</label>
              <CnicInput name="cnic" defaultValue={patient.cnic || ''} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <Input name="email" type="email" defaultValue={patient.email || ''} placeholder="patient@email.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Blood Group</label>
              <select name="blood_group" defaultValue={patient.blood_group || 'Unknown'} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent dark:border-slate-700 dark:text-slate-50">
                <option value="Unknown">Unknown</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Allergies</label>
              <Input name="allergies" defaultValue={patient.allergies || ''} placeholder="Known drug/food allergies" />
            </div>
            
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
              <textarea name="notes" defaultValue={patient.notes || ''} rows={4} className="flex w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent dark:border-slate-700 dark:text-slate-50 resize-y" placeholder="Additional notes..."></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700 mt-6">
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
