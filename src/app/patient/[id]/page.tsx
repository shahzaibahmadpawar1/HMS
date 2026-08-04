import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Printer, Save, FileText, History, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function PatientConsultation({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const patientId = resolvedParams.id;
  
  // Fetch patient details from Supabase
  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', patientId)
    .single();

  if (error || !patient) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Patient Header & Vitals Ribbon */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              ({patient.patient_mrn || 'N/A'}) {patient.name.toUpperCase()} (DOB: {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'} / {patient.gender?.toUpperCase() || 'N/A'})
            </h1>
          </div>
          <Button variant="outline" size="sm">Re-Take Vitals</Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {[
            { label: "Temp", id: "temp" },
            { label: "B/P", id: "bp" },
            { label: "Pulse", id: "pulse" },
            { label: "R/R", id: "rr" },
            { label: "RBS", id: "rbs" },
            { label: "FBS", id: "fbs" },
            { label: "Weight", id: "weight" },
            { label: "Height", id: "height" },
            { label: "SPO2", id: "spo2" }
          ].map((vital) => (
            <div key={vital.id} className="flex flex-col">
              <label htmlFor={vital.id} className="text-xs text-slate-500 mb-1">{vital.label}:</label>
              <Input id={vital.id} className="h-8 bg-slate-50 dark:bg-slate-900 border-slate-200" />
            </div>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-auto pb-24">
        <Tabs defaultValue="current-visit" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-2 bg-transparent p-0">
            <TabsTrigger 
              value="current-visit" 
              className="flex flex-col items-start p-4 border border-slate-200 data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/20 data-[state=active]:shadow-sm rounded-xl justify-center h-full"
            >
              <span className="flex items-center gap-2 font-bold text-lg text-slate-800 dark:text-slate-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-emerald-500 text-emerald-500 text-xs">1</span>
                Current Visit Plan
              </span>
              <span className="text-xs text-slate-500 mt-1 font-normal text-left">Presenting Complain, Provisional Diagnosis, Clinical History & Examination.</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="advice" 
              className="flex flex-col items-start p-4 border border-slate-200 data-[state=active]:border-amber-500 data-[state=active]:bg-amber-50 dark:data-[state=active]:bg-amber-950/20 data-[state=active]:shadow-sm rounded-xl justify-center h-full"
            >
              <span className="flex items-center gap-2 font-bold text-lg text-slate-800 dark:text-slate-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-amber-500 text-amber-500 text-xs">2</span>
                Advice
              </span>
              <span className="text-xs text-slate-500 mt-1 font-normal text-left">Investigations, Medication & Follow-Up.</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="admission" 
              className="flex flex-col items-start p-4 border border-slate-200 data-[state=active]:border-rose-500 data-[state=active]:bg-rose-50 dark:data-[state=active]:bg-rose-950/20 data-[state=active]:shadow-sm rounded-xl justify-center h-full"
            >
              <span className="flex items-center gap-2 font-bold text-lg text-slate-800 dark:text-slate-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-rose-500 text-rose-500 text-xs">3</span>
                Admission
              </span>
              <span className="text-xs text-slate-500 mt-1 font-normal text-left">Create Admission Plan.</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1">
            <TabsContent value="current-visit" className="m-0 h-full">
              {/* This will be replaced by a dedicated component */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Presenting Complaints:</label>
                      <Input placeholder="Select Presenting Complaints" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Provisional Diagnosis (ICD10):</label>
                      <Input placeholder="Select Provisional Diagnosis" />
                    </div>
                  </div>
                  
                  {/* Empty Table placeholder */}
                  <div className="h-64 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden flex flex-col">
                    <div className="bg-slate-900 text-white text-xs font-bold p-2 grid grid-cols-[80px_1fr_100px_80px]">
                      <div>ID</div><div>TITLE</div><div>TYPE</div><div>ACTION</div>
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/50"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Reports Findings:</label>
                    <Textarea placeholder="Enter Reports Findings Here!" className="h-32" />
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <div className="flex gap-4 mb-2">
                    {["Diabetes", "IHD / HTN", "Hepatitis B/C", "Asthma/COPD"].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox id={condition} />
                        <label htmlFor={condition} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {condition}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Clinical History:</label>
                    <Textarea placeholder="Enter Clinical History Findings Here!" className="h-64" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Physician Note:</label>
                    <Textarea placeholder="Enter Physician Note Here!" className="h-32" />
                  </div>
                </div>

              </div>
            </TabsContent>
            
            <TabsContent value="advice" className="m-0 h-full">
              <div className="flex items-center justify-center h-64 text-slate-500">
                Advice Component will be built here
              </div>
            </TabsContent>
            
            <TabsContent value="admission" className="m-0 h-full">
              <div className="flex items-center justify-center h-64 text-slate-500">
                Admission Component will be built here
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Sticky Bottom Action Bar */}
      <footer className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex justify-between items-center z-20">
        <div className="flex gap-2">
          <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white border-0 gap-2">
            <History className="w-4 h-4" /> View Past Records
          </Button>
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
            <FileText className="w-4 h-4" /> Diagnostic Reports
          </Button>
          <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white border-0 gap-2">
            <ImageIcon className="w-4 h-4" /> PACS
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white border-0 gap-2">
            <Save className="w-4 h-4" /> Save
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
             Performed
          </Button>
          <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white border-0 gap-2">
            <Printer className="w-4 h-4" /> Preview
          </Button>
        </div>
      </footer>
    </div>
  );
}
