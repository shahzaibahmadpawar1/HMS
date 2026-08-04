import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Calendar, FileText, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { logout } from "./actions/auth";

export const revalidate = 0; // Disable caching for dashboard

export default async function Home() {
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
            <Calendar className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white ml-2">Clinic HMS</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-slate-600 dark:text-slate-300 gap-2">
            <Settings className="h-4 w-4" /> Master Data
          </Button>
          <form action={logout}>
            <Button variant="outline" className="text-slate-600 dark:text-slate-300 gap-2" type="submit">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Patients Directory</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your patients and start new consultations.</p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input type="search" placeholder="Search patients..." className="pl-9 bg-white dark:bg-slate-800" />
            </div>
            <Link href="/patient/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 w-full sm:w-auto">
                <UserPlus className="h-4 w-4" /> Add Patient
              </Button>
            </Link>
          </div>
        </div>

        {/* Patients Grid/List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">MRN</th>
                  <th className="px-6 py-4 font-semibold">Patient Name</th>
                  <th className="px-6 py-4 font-semibold">Age / DOB</th>
                  <th className="px-6 py-4 font-semibold">Gender</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!patients || patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UserPlus className="h-8 w-8 text-slate-300" />
                        <p>No patients found. Add a new patient to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/25 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                        {patient.patient_mrn || '-'}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 capitalize">
                        {patient.gender || '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {patient.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/patient/${patient.id}`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <FileText className="h-4 w-4" /> Start Visit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
