import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { addComplaint, deleteComplaint, addDiagnosis, deleteDiagnosis, addMedicine, deleteMedicine } from "@/app/actions/master-data";

export default async function MasterDataTab() {
  const [
    { data: complaints },
    { data: diagnoses },
    { data: medicines }
  ] = await Promise.all([
    supabase.from('master_complaints').select('*').order('name'),
    supabase.from('master_diagnoses').select('*').order('name'),
    supabase.from('master_medicines').select('*').order('name')
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Master Data</h2>
        <p className="text-slate-500 max-w-2xl text-sm">
          Manage the global dropdown lists used in consultations, such as presenting complaints, diagnoses, and medicines.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <Tabs defaultValue="complaints" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-900/50">
            <TabsTrigger value="complaints">Presenting Complaints</TabsTrigger>
            <TabsTrigger value="diagnoses">Diagnoses (ICD-10)</TabsTrigger>
            <TabsTrigger value="medicines">Medicines</TabsTrigger>
          </TabsList>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="m-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Presenting Complaints</h3>
            </div>
            <form action={addComplaint} className="flex gap-2 mb-6">
              <Input name="name" placeholder="E.g., Fever, Headache..." required className="max-w-sm" />
              <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </form>
            
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm text-left relative">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Complaint Name</th>
                    <th className="px-4 py-3 font-semibold text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints?.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/25">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={deleteComplaint}>
                          <input type="hidden" name="id" value={item.id} />
                          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Diagnoses Tab */}
          <TabsContent value="diagnoses" className="m-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Provisional Diagnoses</h3>
            </div>
            <form action={addDiagnosis} className="flex gap-2 mb-6">
              <Input name="name" placeholder="Diagnosis Name (e.g. Asthma)" required className="max-w-sm" />
              <Input name="icd10_code" placeholder="ICD-10 Code (e.g. J45)" className="max-w-xs" />
              <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </form>
            
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm text-left relative">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Diagnosis</th>
                    <th className="px-4 py-3 font-semibold">ICD-10 Code</th>
                    <th className="px-4 py-3 font-semibold text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnoses?.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/25">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.icd10_code || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={deleteDiagnosis}>
                          <input type="hidden" name="id" value={item.id} />
                          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Medicines Tab */}
          <TabsContent value="medicines" className="m-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Medicines Directory</h3>
            </div>
            <form action={addMedicine} className="flex gap-2 mb-6">
              <Input name="name" placeholder="Generic/Medicine Name (e.g. Paracetamol 500mg)" required className="max-w-sm" />
              <Input name="brand" placeholder="Brand Name (Optional)" className="max-w-xs" />
              <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </form>
            
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm text-left relative">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Medicine Name</th>
                    <th className="px-4 py-3 font-semibold">Brand</th>
                    <th className="px-4 py-3 font-semibold text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines?.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/25">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{item.brand || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={deleteMedicine}>
                          <input type="hidden" name="id" value={item.id} />
                          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
