'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { History, Trash2, Plus, Printer, Save, FileText, Check, ChevronDown, Share2, FileBarChart, Download, ArrowLeft } from "lucide-react";
import { saveVisit } from "@/app/actions/consultation";
import { useRouter } from "next/navigation";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { motion, AnimatePresence } from "framer-motion";
import { AddMedicineDialog } from './ui/add-medicine-dialog';
import Link from 'next/link';

export function ConsultationForm({ 
  patient, 
  masterComplaints, 
  masterDiagnoses, 
  masterMedicines,
  masterServices,
  initialVisitData
}: { 
  patient: any, 
  masterComplaints: any[], 
  masterDiagnoses: any[], 
  masterMedicines: any[],
  masterServices: any[],
  initialVisitData?: any
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("history");
  
  // Modal states
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);

  // Vitals State
  const [vitals, setVitals] = useState({
    temp: initialVisitData?.temp || '', 
    bp: initialVisitData?.bp || '', 
    pulse: initialVisitData?.pulse || '', 
    rr: initialVisitData?.respiratory_rate || '', 
    weight: initialVisitData?.weight || '', 
    height: initialVisitData?.height || '', 
    spo2: initialVisitData?.spo2 || ''
  });

  // Notes & Text Areas
  const [notes, setNotes] = useState({
    clinical_history: initialVisitData?.clinical_history || '', 
    reports_findings: initialVisitData?.reports_findings || '', // Examination
    physician_note: initialVisitData?.physician_note || '', // Assessment
    plan: initialVisitData?.plan || '',
    advice: initialVisitData?.advice_instructions || ''
  });
  
  const [followUp, setFollowUp] = useState({
    value: initialVisitData?.next_visit_days || '',
    unit: initialVisitData?.next_visit_frequency || 'Days'
  });

  // Lists
  const [selectedComplaints, setSelectedComplaints] = useState<any[]>(initialVisitData?.complaints || []);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<any[]>(initialVisitData?.diagnoses || []);
  const [prescribedMedications, setPrescribedMedications] = useState<any[]>(initialVisitData?.medications || []);
  const [investigations, setInvestigations] = useState<any[]>(initialVisitData?.investigations || []);

  // Temporary selection state for adding to lists
  const [currentComplaint, setCurrentComplaint] = useState("");
  const [currentDiagnosis, setCurrentDiagnosis] = useState("");
  const [currentInvestigation, setCurrentInvestigation] = useState("");

  const handleSave = async (printAfter: boolean = false) => {
    setIsSaving(true);
    const visitData = {
      patient_id: patient.id,
      vitals,
      notes,
      followUp,
      checkboxes: { diabetes: false, htn: false, hepatitis: false, asthma: false }, // Keeping dummy for backward compatibility if needed
      complaints: selectedComplaints.map(c => c.id),
      diagnoses: selectedDiagnoses.map(d => d.id),
      investigations: investigations.map(i => i.id),
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
      if (printAfter) {
        window.print();
      } else {
        alert("Visit Saved Successfully!");
      }
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
  
  const addInvestigation = () => {
    const found = masterServices.find(s => s.id === currentInvestigation);
    if (found && !investigations.find(i => i.id === found.id)) {
      setInvestigations([...investigations, found]);
    }
    setCurrentInvestigation("");
  };

  const handleMedicineAdded = (med: any) => {
    setPrescribedMedications([...prescribedMedications, med]);
  };
  
  // Calculate age
  let age = "-";
  if (patient.dob) {
    const birthDate = new Date(patient.dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }
    age = years.toString();
  } else if (patient.age_dob) {
    age = patient.age_dob;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans">
      
      {/* Top Header with Stepper & Patient Info */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-20 print:hidden shadow-sm flex-shrink-0">
        <div className="max-w-[1400px] mx-auto p-4 lg:px-8">
          
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium text-sm transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
            </Link>
            
            {/* Stepper */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[600px]">
              <TabsList className="w-full flex p-1 bg-transparent justify-between border-b-0 h-auto">
                <TabsTrigger value="history" className="flex-1 flex flex-col items-start gap-1 p-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none border-b-2 border-transparent">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${activeTab === 'history' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' : 'border-slate-300 text-slate-400'}`}>1</div>
                    <div className={`font-semibold text-sm ${activeTab === 'history' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>History & Notes</div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium pl-8">Presenting Complaint, Diagnosis, Clinical History</div>
                </TabsTrigger>
                
                <TabsTrigger value="examination" className="flex-1 flex flex-col items-start gap-1 p-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none border-b-2 border-transparent">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${activeTab === 'examination' ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30' : 'border-slate-300 text-slate-400'}`}>2</div>
                    <div className={`font-semibold text-sm ${activeTab === 'examination' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Examination</div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium pl-8">Vitals, Findings, Assessment, Plan & Follow-Up</div>
                </TabsTrigger>
                
                <TabsTrigger value="prescription" className="flex-1 flex flex-col items-start gap-1 p-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 rounded-none border-b-2 border-transparent">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${activeTab === 'prescription' ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30' : 'border-slate-300 text-slate-400'}`}>3</div>
                    <div className={`font-semibold text-sm ${activeTab === 'prescription' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Prescription</div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium pl-8">Medications, Investigations & Advice</div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="w-[120px]"></div> {/* Spacer */}
          </div>

          {/* Patient Overview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm col-span-1 lg:col-span-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Name of Patient</div>
              <div className="font-bold text-slate-900 dark:text-white uppercase truncate">{patient.name}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">MRN</div>
              <div className="font-bold text-indigo-600 dark:text-indigo-400 truncate">{patient.patient_mrn}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Gender</div>
              <div className="font-bold text-slate-900 dark:text-white capitalize">{patient.gender || '-'}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Age</div>
              <div className="font-bold text-slate-900 dark:text-white">{age}</div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Blood Group</div>
              <div className="font-bold text-slate-900 dark:text-white">{patient.blood_group || '-'}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Phone Number</div>
              <div className="font-bold text-slate-900 dark:text-white">{patient.phone || '-'}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Address</div>
              <div className="font-bold text-slate-900 dark:text-white truncate">{patient.address || '-'}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Date of Birth</div>
              <div className="font-bold text-slate-900 dark:text-white">{patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Allergies</div>
              <div className="font-bold text-rose-500 truncate">{patient.allergies || 'No known allergies'}</div>
            </div>
            
            {/* Extra Metadata Row */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm text-indigo-900 dark:text-indigo-200 col-span-1">
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">Visit Date</div>
              <div className="font-bold">{new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Visit Time</div>
              <div className="font-bold text-slate-900 dark:text-white" suppressHydrationWarning>{new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Clinic</div>
              <div className="font-bold text-slate-900 dark:text-white uppercase">Primary Clinic</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Visit Type</div>
              <div className="font-bold text-slate-900 dark:text-white">OPD Consultation</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/30 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Fee Amount</div>
                <div className="font-black text-emerald-700 dark:text-emerald-300 text-lg flex items-end gap-1">
                  <span className="text-xs font-bold mb-1">Rs</span> 500
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-[1400px] mx-auto p-4 lg:p-8">
          
          <AnimatePresence mode="wait">
            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  {/* Presenting Complaints */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="flex items-center text-sm font-bold text-indigo-500 mb-4 uppercase tracking-widest gap-2">
                      <FileText className="w-4 h-4" /> Presenting Complaints
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1">
                        <SearchableSelect 
                          options={masterComplaints.map(c => ({ value: c.id, label: c.name }))}
                          value={currentComplaint}
                          onChange={val => setCurrentComplaint(val)}
                          placeholder="Select Complaint"
                        />
                      </div>
                      <Button type="button" onClick={addComplaint} className="shrink-0 bg-indigo-500 hover:bg-indigo-600"><Plus className="h-4 w-4" /></Button>
                    </div>
                    {selectedComplaints.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedComplaints.map(c => (
                          <div key={c.id} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 border border-indigo-100 dark:border-indigo-800">
                            {c.name}
                            <button onClick={() => setSelectedComplaints(selectedComplaints.filter(x => x.id !== c.id))} className="text-indigo-400 hover:text-rose-500 transition-colors">&times;</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400 italic">No complaints added yet.</div>
                    )}
                  </div>

                  {/* Provisional Diagnosis */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="flex items-center text-sm font-bold text-indigo-500 mb-4 uppercase tracking-widest gap-2">
                      <Check className="w-4 h-4" /> Provisional Diagnosis
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1">
                        <SearchableSelect 
                          options={masterDiagnoses.map(d => ({ value: d.id, label: `${d.name}${d.icd10_code ? ` (${d.icd10_code})` : ''}` }))}
                          value={currentDiagnosis}
                          onChange={val => setCurrentDiagnosis(val)}
                          placeholder="Select Diagnosis"
                        />
                      </div>
                      <Button type="button" onClick={addDiagnosis} className="shrink-0 bg-indigo-500 hover:bg-indigo-600"><Plus className="h-4 w-4" /></Button>
                    </div>
                    {selectedDiagnoses.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedDiagnoses.map(d => (
                          <div key={d.id} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 border border-indigo-100 dark:border-indigo-800">
                            {d.name}
                            <button onClick={() => setSelectedDiagnoses(selectedDiagnoses.filter(x => x.id !== d.id))} className="text-indigo-400 hover:text-rose-500 transition-colors">&times;</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400 italic">No diagnoses added yet.</div>
                    )}
                  </div>
                </div>

                {/* Clinical History */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full min-h-[400px]">
                  <h3 className="flex items-center text-sm font-bold text-indigo-500 mb-4 uppercase tracking-widest gap-2">
                    <History className="w-4 h-4" /> Clinical History
                  </h3>
                  <Textarea 
                    value={notes.clinical_history} 
                    onChange={e => setNotes({...notes, clinical_history: e.target.value})} 
                    className="flex-1 resize-none bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-1 focus-visible:ring-indigo-500 text-base" 
                    placeholder="Enter detailed clinical history here..."
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "examination" && (
              <motion.div 
                key="examination"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Vitals Bar */}
                <div className="bg-[#FFFDF0] dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex flex-wrap gap-8 items-center shadow-sm">
                  {[
                    { key: 'temp', label: 'Temp', unit: '°F' },
                    { key: 'bp', label: 'B/P', unit: 'mmHg', divider: '/' },
                    { key: 'pulse', label: 'Pulse', unit: 'bpm' },
                    { key: 'rr', label: 'R/R', unit: '/min' },
                    { key: 'spo2', label: 'SPO2', unit: '%' },
                    { key: 'weight', label: 'Weight', unit: 'kg' },
                    { key: 'height', label: 'Height', unit: 'cm' },
                  ].map((vital) => (
                    <div key={vital.key} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase">{vital.label}:</span>
                      <div className="flex items-center border-b border-amber-300 dark:border-amber-700/50">
                        <input 
                          type="text" 
                          value={(vitals as any)[vital.key]} 
                          onChange={e => setVitals({...vitals, [vital.key]: e.target.value})}
                          className="w-12 bg-transparent text-center font-semibold text-slate-700 dark:text-slate-300 outline-none"
                          placeholder="-"
                        />
                        {vital.divider && <span className="text-slate-400 mx-1">{vital.divider}</span>}
                      </div>
                      <span className="text-[10px] text-amber-600/70 dark:text-amber-500/50 font-medium">{vital.unit}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    {/* Examination / Findings */}
                    <div>
                      <h3 className="flex items-center text-sm font-bold text-amber-600 dark:text-amber-500 mb-3 uppercase tracking-widest gap-2 border-b border-amber-100 dark:border-amber-900/30 pb-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Examination / Findings
                      </h3>
                      <Textarea 
                        value={notes.reports_findings} 
                        onChange={e => setNotes({...notes, reports_findings: e.target.value})} 
                        className="h-48 resize-none bg-white dark:bg-slate-800 border-none shadow-sm focus-visible:ring-1 focus-visible:ring-amber-500" 
                        placeholder="Enter examination findings..."
                      />
                    </div>
                    
                    {/* Plan */}
                    <div>
                      <h3 className="flex items-center text-sm font-bold text-amber-600 dark:text-amber-500 mb-3 uppercase tracking-widest gap-2 border-b border-amber-100 dark:border-amber-900/30 pb-2">
                        <FileText className="w-4 h-4" /> Plan
                      </h3>
                      <Textarea 
                        value={notes.plan} 
                        onChange={e => setNotes({...notes, plan: e.target.value})} 
                        className="h-32 resize-none bg-white dark:bg-slate-800 border-none shadow-sm focus-visible:ring-1 focus-visible:ring-amber-500" 
                        placeholder="Further plan — admission, operation, procedure, referral..."
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Physician Assessment */}
                    <div>
                      <h3 className="flex items-center text-sm font-bold text-amber-600 dark:text-amber-500 mb-3 uppercase tracking-widest gap-2 border-b border-amber-100 dark:border-amber-900/30 pb-2">
                        <FileText className="w-4 h-4" /> Physician Assessment / Notes
                      </h3>
                      <Textarea 
                        value={notes.physician_note} 
                        onChange={e => setNotes({...notes, physician_note: e.target.value})} 
                        className="h-48 resize-none bg-white dark:bg-slate-800 border-none shadow-sm focus-visible:ring-1 focus-visible:ring-amber-500" 
                        placeholder="Enter Physician Assessment Here!"
                      />
                    </div>

                    {/* Follow-Up */}
                    <div>
                      <h3 className="flex items-center text-sm font-bold text-amber-600 dark:text-amber-500 mb-3 uppercase tracking-widest gap-2 border-b border-amber-100 dark:border-amber-900/30 pb-2">
                        <History className="w-4 h-4" /> Follow-Up
                      </h3>
                      <div className="flex gap-4">
                        <Input 
                          placeholder="#" 
                          className="w-24 bg-white dark:bg-slate-800 border-none shadow-sm font-bold text-center" 
                          value={followUp.value}
                          onChange={e => setFollowUp({...followUp, value: e.target.value})}
                        />
                        <select 
                          className="flex h-10 w-full max-w-[200px] rounded-md border-none bg-white shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-slate-800 dark:text-slate-50"
                          value={followUp.unit}
                          onChange={e => setFollowUp({...followUp, unit: e.target.value})}
                        >
                          <option value="Days">Days</option>
                          <option value="Weeks">Weeks</option>
                          <option value="Months">Months</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "prescription" && (
              <motion.div 
                key="prescription"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-8">
                  {/* Investigations & Orders */}
                  <div>
                    <h3 className="flex items-center text-sm font-bold text-rose-500 mb-3 uppercase tracking-widest gap-2 border-b border-rose-100 dark:border-rose-900/30 pb-2">
                      <FileBarChart className="w-4 h-4" /> Investigations & Orders
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1">
                        <SearchableSelect 
                          options={masterServices.map(s => ({ value: s.id, label: s.name }))}
                          value={currentInvestigation}
                          onChange={val => setCurrentInvestigation(val)}
                          placeholder="Select Investigation"
                        />
                      </div>
                      <Button type="button" onClick={addInvestigation} className="shrink-0 bg-indigo-500 hover:bg-indigo-600"><Plus className="h-4 w-4" /> Add</Button>
                    </div>
                    {investigations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {investigations.map(i => (
                          <div key={i.id} className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg text-sm flex items-center justify-between gap-4 border border-slate-200 dark:border-slate-700 shadow-sm w-full max-w-sm">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{i.name}</span>
                            <button onClick={() => setInvestigations(investigations.filter(x => x.id !== i.id))} className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Advice & Instructions */}
                  <div>
                    <h3 className="flex items-center text-sm font-bold text-rose-500 mb-3 uppercase tracking-widest gap-2 border-b border-rose-100 dark:border-rose-900/30 pb-2">
                      <FileText className="w-4 h-4" /> Advice & Instructions
                    </h3>
                    <Textarea 
                      value={notes.advice} 
                      onChange={e => setNotes({...notes, advice: e.target.value})} 
                      className="h-48 resize-none bg-white dark:bg-slate-800 border-none shadow-sm focus-visible:ring-1 focus-visible:ring-rose-500" 
                      placeholder="Search — water, rest, diet..."
                    />
                  </div>
                </div>

                {/* Medications */}
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3 border-b border-rose-100 dark:border-rose-900/30 pb-2">
                    <h3 className="flex items-center text-sm font-bold text-rose-500 uppercase tracking-widest gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      Medications
                    </h3>
                    <Button onClick={() => setIsAddMedicineOpen(true)} size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg gap-2 h-8 px-3">
                      <Plus className="w-4 h-4" /> Add Medicine
                    </Button>
                  </div>

                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                    {prescribedMedications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center flex-1 text-slate-400 p-8 text-center min-h-[300px]">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                          <Plus className="w-8 h-8" />
                        </div>
                        <p>No medicines yet. Click <strong>Add Medicine</strong> above to start.</p>
                      </div>
                    ) : (
                      <div className="overflow-y-auto flex-1">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                            <tr>
                              <th className="px-4 py-3 font-semibold text-slate-500">Medicine</th>
                              <th className="px-4 py-3 font-semibold text-slate-500">Dosage</th>
                              <th className="px-4 py-3 text-right"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescribedMedications.map((med, idx) => (
                              <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                                <td className="px-4 py-4">
                                  <div className="font-bold text-slate-900 dark:text-white text-base">{med.name}</div>
                                  <div className="text-xs text-slate-500 mt-0.5">{med.route}</div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex flex-wrap gap-2 items-center text-sm">
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{med.dose}</span>
                                    <span className="text-slate-400">&bull;</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{med.frequency}</span>
                                    <span className="text-slate-400">&bull;</span>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">{med.duration}</span>
                                  </div>
                                  {med.instructions && med.instructions !== '-' && (
                                    <div className="text-xs text-slate-500 mt-1 italic">{med.instructions}</div>
                                  )}
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <Button variant="ghost" size="icon" onClick={() => setPrescribedMedications(prescribedMedications.filter((_, i) => i !== idx))} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Action Dock */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 px-6 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
      >
        <div className="flex gap-2 items-center">
          <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold h-10 px-4 rounded-xl gap-2 transition-all">
            <History className="w-4 h-4" /> View Past Records
          </Button>
          <Button variant="ghost" className="text-slate-600 dark:text-slate-400 font-medium h-10 px-4 rounded-xl gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:flex">
            <Share2 className="w-4 h-4" /> Copy / Compare
          </Button>
          <Button variant="ghost" className="text-slate-600 dark:text-slate-400 font-medium h-10 px-4 rounded-xl gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 hidden md:flex">
            <FileBarChart className="w-4 h-4" /> Diagnostic Reports
          </Button>
        </div>
        
        <div className="flex gap-3 items-center">
          <Button onClick={() => handleSave(false)} disabled={isSaving} variant="outline" className="h-10 px-6 rounded-xl font-bold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 gap-2 transition-all">
            <Download className="w-4 h-4" /> Update
          </Button>
          <Button onClick={() => handleSave(true)} disabled={isSaving} className="h-10 px-6 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
            <Check className="w-4 h-4" /> Update & Print
          </Button>
          
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2 hidden lg:block"></div>
          
          <Button variant="ghost" className="text-slate-600 dark:text-slate-400 font-medium h-10 px-3 rounded-xl gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 hidden lg:flex">
            Preview
          </Button>
          <Button variant="ghost" className="text-slate-600 dark:text-slate-400 font-medium h-10 px-3 rounded-xl gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 hidden xl:flex">
            Save PDF
          </Button>
        </div>
      </motion.div>

      {/* Add Medicine Modal */}
      <AddMedicineDialog 
        open={isAddMedicineOpen} 
        onOpenChange={setIsAddMedicineOpen}
        masterMedicines={masterMedicines}
        onAdd={handleMedicineAdded}
        medicineCount={prescribedMedications.length + 1}
      />

    </div>
  );
}
