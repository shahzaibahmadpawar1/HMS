import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

async function addPatient(formData: FormData) {
  'use server';
  
  const name = formData.get('name') as string;
  const dob = formData.get('dob') as string;
  const gender = formData.get('gender') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;

  const { data, error } = await supabase
    .from('patients')
    .insert({
      name,
      dob: dob || null, // Will insert as DATE type in Supabase
      gender,
      phone,
      address
    })
    .select()
    .single();

  if (error || !data) {
    console.error(error);
    redirect('/patient/new?error=failed');
  }

  // Redirect to their consultation page immediately
  redirect(`/patient/${data.id}`);
}

export default function NewPatientPage() {
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Patient</h1>
            <p className="text-sm text-slate-500">Register a new patient into the system.</p>
          </div>
        </div>

        <form action={addPatient} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name *</label>
              <Input name="name" required placeholder="John Doe" />
            </div>
            <div className="space-y-2 flex flex-col justify-end pb-2">
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                MRN will be auto-generated
              </span>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date of Birth</label>
              <Input name="dob" type="date" max={new Date().toISOString().split('T')[0]} required className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
              <select name="gender" className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent dark:border-slate-700 dark:text-slate-50">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
              <Input name="phone" type="tel" placeholder="e.g. 0300-1234567" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
              <Input name="address" placeholder="Full residential address" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700 mt-6">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Save className="h-4 w-4" /> Save Patient & Start Visit
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
