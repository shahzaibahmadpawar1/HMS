'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { History, Image as ImageIcon, Trash2, Plus, Printer, Save, FileText } from "lucide-react";
import { saveVisit } from "@/app/actions/consultation";
import { useRouter } from "next/navigation";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { motion, AnimatePresence } from "framer-motion";

const DOSE_OPTIONS = [
  "OD", "BD", "TDS", "QDS", "PRN", "HS", "AC", "PC", "STAT", "BID", "ODS", "TID", 
  "QID", "QOD", "PR", "IM", "IV", "SC", "NPO", "DNE", "TL", "qhs", "q2h", "q4h", 
  "q8h", "BIDPRN", "HSPRN", "PCOD", "SL", "BU", "AU", "OS", "CPOE", "NKA", "RX", 
  "BIDQHS", "PRNQ4H", "Q2W", "Q4W", "PRNQ8H", "BIDQAM", "PRNPR", "SOD", "ET", 
  "qam", "qpm", "TIDPRN", "AM", "PM", "QD", "QDPRN", "QDHS", "BIDAM", "BIDPM", 
  "ODT", "NGT", "IUD", "IVP", "CVD", "CPR", "D/C", "FL", "H2O", "mg/kg", 
  "QAMPRN", "QPMPRN", "BIDAC", "BIDPC", "TIDAC", "TIDPC", "PRNQHS", "IVPB", 
  "3 OD", "4 OD", "2 BD", "4 BD", "3 TDS", "EVERY THREE MONTH", "SOS", "2 OD", 
  "1/2 BD", "1/4 BD", "1/4 TDS", "5 OD", "6 OD", "3 BD", "4 TDS", "1/2 TDS", 
  "Q12H", "1/4 OD", "2 TDS", "TSF", "BM/ES", "1/2 OD", "BEFORE BREAKFAST ONLY", 
  "EVERY 6 HOURS", "BEFORE GO TO SLEEP", "BEFORE LUNCH", "ONCE A DAY", 
  "IN CASE OF VOMITING", "IN CASE OF VERTIGO", "BEFORE BREAKFAST", "BEFORE DINNER", 
  "AFTER LUNCH", "EVERY FOUR HOURS", "EVERY SIX HOURS", "EVERY EIGHT HOURS", 
  "DAILY AT MORNING", "ONCE DAILY", "BEFORE SLEEPING", "MORNING AND EVENING", 
  "ONCE A WEEK", "TWICE A WEEK", "3 TIMES A WEEK", "AFTER MEAL", "BEFORE MEAL", 
  "AFTER FIVE TIME EVERY FOUR HOURS IN A DAY", "FIVE TABLETS IN A WEEK", 
  "FOUR TABLETS IN A WEEK", "TWO TABLETS IN A WEEK", "SIX TABLETS IN A WEEK", 
  "THREE TABLETS IN A WEEK", "EVERY SIX HOUR", "ONE TEA SPOON", "TWO TEA SPOON", 
  "THREE TEA SPOON", "I/M I/V INJ", "S/C SUBCONTANEOUS", "IN EYES", "IN EARS", 
  "THROUGH CENTRAL LINE", "NASOGASTRIC TUBE", "LOCAL APPLICATION L/A", 
  "INHALATION", "I/M INJ.", "I/V INJ.", "1 + 1 + 1", "1 + 0 + 1", "1 + 0 + 0", 
  "0 + 0 + 1", "0 + 1 + 0", "1 + 1 + 0", "0 + 1 + 1", "2 + 2 + 2", "2 + 0 + 2", 
  "2 + 0 + 0", "0 + 0 + 2", "3 + 3 + 3", "0 + 3 + 3", "3 + 0 + 0", "0 + 3 + 0", 
  "0 + 0 + 3", "0.5 + 0.5 + 0.5", "0.5 + 0 + 0.5", "0.5 + 0 + 0", "0 + 0.5 + 0", 
  "0 + 0 + 0.5", "0.25 + 0.25 + 0.25", "0.25 + 0 + 0.25", "0.25 + 0 + 0", 
  "0 + 0.25 + 0", "0 + 0 + 0.25", "1 + 2 + 1", "1 + 1 + 2", "1 + 0 + 2", 
  "1 + 2 + 2", "1 + 2 + 0", "1 + 3 + 1", "0 + 2 + 3", "0 + 3 + 1", "0 + 3 + 2", 
  "1 + 0 + 3", "1 + 1 + 3", "3 + 1 + 1", "0 + 2 + 1", "0.33 + 0 + 0", 
  "0.33 + 0.33 + 0.33", "0.33 + 0 + 0.33", "0 + 0.33 + 0", "0 + 0 + 0.33", 
  "1 + 1 + 1 + 1 + 1", "6 + 6 + 0"
];

const ROUTE_OPTIONS = [
  "ORAL", "Buccal", "Rectal", "Nasal", "Ophthalmic", "Otic", "Vaginal",
  "Intraosseous (IO)", "Intrathecal", "Epidural", "Intraperitoneal",
  "Intravenous (IV)", "Intrapleural", "Intra-arterial", "Endotracheal",
  "Intracardiac", "Intraarticular", "Intralesional", "Intravitreal",
  "Urethral", "Intrabursal", "Intracavernous", "Intramuscular (IM)",
  "Intratumoral", "Subcutaneous (SC or SubQ)", "Intradermal (ID)",
  "Topical", "Transdermal", "Inhalation", "Sublingual"
];

export function ConsultationForm({ 
  patient, 
  masterComplaints, 
  masterDiagnoses, 
  masterMedicines,
  initialVisitData
}: { 
  patient: any, 
  masterComplaints: any[], 
  masterDiagnoses: any[], 
  masterMedicines: any[],
  initialVisitData?: any
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("plan");

  // Vitals State
  const [vitals, setVitals] = useState({
    temp: initialVisitData?.temp || '', 
    bp: initialVisitData?.bp || '', 
    pulse: initialVisitData?.pulse || '', 
    rr: initialVisitData?.respiratory_rate || '', 
    rbs: initialVisitData?.rbs || '', 
    fbs: initialVisitData?.fbs || '', 
    weight: initialVisitData?.weight || '', 
    height: initialVisitData?.height || '', 
    spo2: initialVisitData?.spo2 || ''
  });

  // Checkboxes
  const [checkboxes, setCheckboxes] = useState({
    diabetes: initialVisitData?.has_diabetes || false, 
    htn: initialVisitData?.has_ihd_htn || false, 
    hepatitis: initialVisitData?.has_hepatitis || false, 
    asthma: initialVisitData?.has_asthma || false
  });

  // Notes
  const [notes, setNotes] = useState({
    clinical_history: initialVisitData?.clinical_history || '', 
    physician_note: initialVisitData?.physician_note || '', 
    reports_findings: initialVisitData?.reports_findings || ''
  });

  // Lists
  const [selectedComplaints, setSelectedComplaints] = useState<any[]>(initialVisitData?.complaints || []);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<any[]>(initialVisitData?.diagnoses || []);
  const [prescribedMedications, setPrescribedMedications] = useState<any[]>(initialVisitData?.medications || []);

  // Temporary selection state for adding to lists
  const [currentComplaint, setCurrentComplaint] = useState("");
  const [currentDiagnosis, setCurrentDiagnosis] = useState("");
  const [currentMed, setCurrentMed] = useState({ id: "", route: ROUTE_OPTIONS[0], dose: DOSE_OPTIONS[0], frequency: "OD (Once a day)", duration: "3 Days" });

  const handleSave = async () => {
    setIsSaving(true);
    const visitData = {
      patient_id: patient.id,
      vitals,
      checkboxes,
      notes,
      complaints: selectedComplaints.map(c => c.id),
      diagnoses: selectedDiagnoses.map(d => d.id),
      medications: prescribedMedications.map(m => ({
        medicine_id: m.id,
        route: m.route,
        dose: m.dose,
        frequency: m.frequency,
        duration_days: m.duration
      }))
    };

    const res = await saveVisit(visitData);
    if (res.success) {
      alert("Visit Saved and Completed!");
      router.push('/');
    } else {
      alert("Error saving visit");
      setIsSaving(false);
    }
  };

  const addComplaint = () => {
    const found = masterComplaints.find(c => c.id === currentComplaint);
    if (found && !selectedComplaints.find(c => c.id === found.id)) {
      setSelectedComplaints([...selectedComplaints, found]);
    }
    setCurrentComplaint("");
  };

  const addDiagnosis = () => {
    const found = masterDiagnoses.find(d => d.id === currentDiagnosis);
    if (found && !selectedDiagnoses.find(d => d.id === found.id)) {
      setSelectedDiagnoses([...selectedDiagnoses, found]);
    }
    setCurrentDiagnosis("");
  };

  const addMedication = () => {
    const found = masterMedicines.find(m => m.id === currentMed.id);
    if (found) {
      setPrescribedMedications([...prescribedMedications, { ...found, ...currentMed }]);
      setCurrentMed({ id: "", route: ROUTE_OPTIONS[0], dose: DOSE_OPTIONS[0], frequency: "OD (Once a day)", duration: "3 Days" });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 relative">
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Vitals Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {Object.keys(vitals).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-semibold">{key}:</label>
                <Input 
                  className="h-8 bg-slate-50 dark:bg-slate-900 border-slate-200" 
                  value={(vitals as any)[key]} 
                  onChange={e => setVitals({...vitals, [key]: e.target.value})}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Tabs UI */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full p-4 lg:p-8 max-w-7xl mx-auto flex flex-col h-full">
          
          <TabsList className="w-full flex p-1.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm mb-8 sticky top-[73px] z-20 overflow-x-auto hide-scrollbar">
            <TabsTrigger value="plan" className="flex-1 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 transition-all py-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">1</span>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-sm">Current Visit Plan</div>
                  <div className="text-[10px] text-slate-400 font-normal">Presenting Complain, Provisional Diagnosis, Clinical History & Examination.</div>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="advice" className="flex-1 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm data-[state=active]:text-amber-600 transition-all py-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">2</span>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-sm">Advice</div>
                  <div className="text-[10px] text-slate-400 font-normal">Investigations, Medication & Follow-Up.</div>
                </div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="admission" className="flex-1 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all py-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">3</span>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-sm">Admission</div>
                  <div className="text-[10px] text-slate-400 font-normal">Create Admission Plan.</div>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === "plan" && (
              <TabsContent value="plan" className="m-0 h-full">
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-slate-700">Presenting Complaints:</label>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <SearchableSelect 
                              options={masterComplaints.map(c => ({ value: c.id, label: c.name }))}
                              value={currentComplaint}
                              onChange={val => setCurrentComplaint(val)}
                              placeholder="Select Complaint"
                            />
                          </div>
                          <Button type="button" onClick={addComplaint} variant="secondary" className="shrink-0"><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedComplaints.map(c => (
                            <div key={c.id} className="bg-slate-100 px-3 py-1 rounded-full text-sm flex items-center gap-2 border">
                              {c.name}
                              <button onClick={() => setSelectedComplaints(selectedComplaints.filter(x => x.id !== c.id))} className="text-slate-400 hover:text-rose-500">&times;</button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-slate-700">Provisional Diagnosis:</label>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <SearchableSelect 
                              options={masterDiagnoses.map(d => ({ value: d.id, label: `${d.name}${d.icd10_code ? ` (${d.icd10_code})` : ''}` }))}
                              value={currentDiagnosis}
                              onChange={val => setCurrentDiagnosis(val)}
                              placeholder="Select Diagnosis"
                            />
                          </div>
                          <Button type="button" onClick={addDiagnosis} variant="secondary" className="shrink-0"><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedDiagnoses.map(d => (
                            <div key={d.id} className="bg-slate-100 px-3 py-1 rounded-full text-sm flex items-center gap-2 border">
                              {d.name}
                              <button onClick={() => setSelectedDiagnoses(selectedDiagnoses.filter(x => x.id !== d.id))} className="text-slate-400 hover:text-rose-500">&times;</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Reports Findings:</label>
                      <Textarea value={notes.reports_findings} onChange={e => setNotes({...notes, reports_findings: e.target.value})} className="h-32" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4 mb-2">
                      {[
                        { id: 'diabetes', label: 'Diabetes' },
                        { id: 'htn', label: 'IHD / HTN' },
                        { id: 'hepatitis', label: 'Hepatitis B/C' },
                        { id: 'asthma', label: 'Asthma/COPD' }
                      ].map((condition) => (
                        <div key={condition.id} className="flex items-center space-x-2">
                          <Checkbox id={condition.id} checked={(checkboxes as any)[condition.id]} onCheckedChange={checked => setCheckboxes({...checkboxes, [condition.id]: checked as boolean})} />
                          <label htmlFor={condition.id} className="text-sm font-medium cursor-pointer select-none">{condition.label}</label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Clinical History:</label>
                      <Textarea value={notes.clinical_history} onChange={e => setNotes({...notes, clinical_history: e.target.value})} className="h-64" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Physician Note:</label>
                      <Textarea value={notes.physician_note} onChange={e => setNotes({...notes, physician_note: e.target.value})} className="h-32" />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            )}

            {activeTab === "advice" && (
              <TabsContent value="advice" className="m-0 h-full">
                <motion.div 
                  key="advice"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end bg-white p-6 rounded-lg border border-slate-200">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-slate-700">Medicine</label>
                      <SearchableSelect options={masterMedicines.map(m => ({ value: m.id, label: `${m.name}${m.brand ? ` (${m.brand})` : ''}` }))} value={currentMed.id} onChange={val => setCurrentMed({...currentMed, id: val})} placeholder="Select Medicine" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Route</label>
                      <SearchableSelect options={ROUTE_OPTIONS.map(r => ({ value: r, label: r }))} value={currentMed.route} onChange={val => setCurrentMed({...currentMed, route: val || ROUTE_OPTIONS[0]})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Dose</label>
                      <SearchableSelect options={DOSE_OPTIONS.map(d => ({ value: d, label: d }))} value={currentMed.dose} onChange={val => setCurrentMed({...currentMed, dose: val || DOSE_OPTIONS[0]})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Frequency</label>
                      <SearchableSelect options={[{ value: "OD (Once a day)", label: "OD (Once a day)" }, { value: "BD (Twice a day)", label: "BD (Twice a day)" }, { value: "TDS (Thrice a day)", label: "TDS (Thrice a day)" }, { value: "QID (Four times a day)", label: "QID (Four times a day)" }, { value: "SOS (As needed)", label: "SOS (As needed)" }]} value={currentMed.frequency} onChange={val => setCurrentMed({...currentMed, frequency: val || "OD (Once a day)"})} />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium text-slate-700">Duration</label>
                        <SearchableSelect options={[{ value: "3 Days", label: "3 Days" }, { value: "5 Days", label: "5 Days" }, { value: "7 Days", label: "7 Days" }, { value: "10 Days", label: "10 Days" }, { value: "14 Days", label: "14 Days" }, { value: "1 Month", label: "1 Month" }]} value={currentMed.duration} onChange={val => setCurrentMed({...currentMed, duration: val || "3 Days"})} />
                      </div>
                      <Button onClick={addMedication}><Plus className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs bg-slate-50 border-b">
                        <tr><th className="px-4 py-3">Medicine</th><th className="px-4 py-3">Route</th><th className="px-4 py-3">Dose</th><th className="px-4 py-3">Frequency</th><th className="px-4 py-3">Duration</th><th className="px-4 py-3 text-right">Action</th></tr>
                      </thead>
                      <tbody>
                        {prescribedMedications.map((med, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="px-4 py-3">{med.name}</td>
                            <td className="px-4 py-3">{med.route}</td>
                            <td className="px-4 py-3">{med.dose}</td>
                            <td className="px-4 py-3">{med.frequency}</td>
                            <td className="px-4 py-3">{med.duration}</td>
                            <td className="px-4 py-3 text-right"><Button variant="ghost" size="icon" onClick={() => setPrescribedMedications(prescribedMedications.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4" /></Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </TabsContent>
            )}

            {activeTab === "admission" && (
              <TabsContent value="admission" className="m-0 h-full">
                <motion.div 
                  key="admission"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center h-64 text-slate-400"
                >
                  Admission module coming soon...
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
      </div>

      {/* Floating Action Dock */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div className="pointer-events-auto glass-panel px-6 py-4 rounded-full flex items-center justify-between gap-6 premium-shadow border border-white/40 dark:border-slate-700/60 w-full max-w-3xl min-w-[320px]">
          <div className="text-sm font-medium text-slate-500 hidden sm:block truncate pr-4">
            Consultation for <span className="text-slate-900 dark:text-white font-bold">{patient.name}</span>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <Button variant="ghost" className="gap-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Print</span>
            </Button>
            
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 premium-shadow-hover active:scale-95 transition-all">
              <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save & Finish'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* PRINT LAYOUT (Hidden normally, block when printing) */}
      <div className="hidden print:block p-8 bg-white text-black min-h-screen">
        {/* Clinic Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
          <h1 className="text-3xl font-black uppercase tracking-widest text-slate-900">Dr. Smith's Clinic</h1>
          <p className="text-slate-600">123 Health Avenue, Medical District • Phone: 0300-1234567</p>
        </div>

        {/* Patient Info Block */}
        <div className="flex justify-between items-start mb-6 border border-slate-300 rounded-lg p-4 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold uppercase">{patient.name}</h2>
            <p className="text-sm">Age/DOB: {patient.dob || patient.age_dob} • Gender: {patient.gender}</p>
            <p className="text-sm mt-1 text-slate-500">Contact: {patient.phone || patient.contact_info || 'N/A'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">MRN: {patient.patient_mrn}</p>
            <p className="text-sm" suppressHydrationWarning>Date: {new Date().toLocaleDateString()}</p>
            <p className="text-sm" suppressHydrationWarning>Time: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Vitals summary if any */}
        {Object.values(vitals).some(v => v !== '') && (
          <div className="mb-6 pb-4 border-b border-slate-200">
            <h3 className="font-bold text-sm uppercase text-slate-500 mb-2">Vitals</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              {Object.keys(vitals).map((k) => (vitals as any)[k] ? <span key={k}><strong>{k.toUpperCase()}:</strong> {(vitals as any)[k]}</span> : null)}
            </div>
          </div>
        )}

        {/* Clinical Info */}
        <div className="grid grid-cols-2 gap-8 mb-8 border-b border-slate-200 pb-8">
          <div>
            <h3 className="font-bold text-sm uppercase text-slate-500 mb-2">Presenting Complaints</h3>
            <ul className="list-disc pl-4 text-sm mb-4">
              {selectedComplaints.length > 0 ? selectedComplaints.map(c => <li key={c.id}>{c.name}</li>) : <li className="text-slate-400">None</li>}
            </ul>

            <h3 className="font-bold text-sm uppercase text-slate-500 mb-2">Provisional Diagnosis</h3>
            <ul className="list-disc pl-4 text-sm">
              {selectedDiagnoses.length > 0 ? selectedDiagnoses.map(d => <li key={d.id}>{d.name} {d.icd10_code ? `(${d.icd10_code})` : ''}</li>) : <li className="text-slate-400">None</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase text-slate-500 mb-2">Clinical Notes & Findings</h3>
            <p className="text-sm whitespace-pre-wrap">{notes.clinical_history || notes.reports_findings || notes.physician_note ? `${notes.clinical_history}\n${notes.reports_findings}\n${notes.physician_note}` : 'No additional notes recorded.'}</p>
          </div>
        </div>

        {/* Rx - Prescription */}
        <div>
          <div className="flex items-end mb-4">
            <span className="text-4xl font-serif font-black mr-2">Rx</span>
            <span className="text-lg font-bold border-b-2 border-slate-200 flex-1">Medications</span>
          </div>
          
          {prescribedMedications.length > 0 ? (
            <div className="space-y-4 pl-8">
              {prescribedMedications.map((m, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-bold text-lg">{idx + 1}. {m.name} {m.brand ? <span className="font-normal text-slate-500">({m.brand})</span> : ''}</span>
                  <span className="text-sm text-slate-600 mt-1">Take <strong>{m.dose}</strong> via <strong>{m.route}</strong>, <strong>{m.frequency}</strong> for <strong>{m.duration}</strong>.</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="pl-8 text-slate-400 italic">No medications prescribed.</p>
          )}
        </div>

        {/* Signature Line */}
        <div className="mt-24 flex justify-end">
          <div className="text-center w-64 border-t-2 border-slate-400 pt-2">
            <p className="font-bold">Doctor's Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
