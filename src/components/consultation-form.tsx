'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Printer, Save, FileText, History, Image as ImageIcon, Trash2, Plus } from "lucide-react";
import { saveVisit } from "@/app/actions/consultation";
import { useRouter } from "next/navigation";

export function ConsultationForm({ 
  patient, 
  masterComplaints, 
  masterDiagnoses, 
  masterMedicines 
}: { 
  patient: any, 
  masterComplaints: any[], 
  masterDiagnoses: any[], 
  masterMedicines: any[] 
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Vitals State
  const [vitals, setVitals] = useState({
    temp: '', bp: '', pulse: '', rr: '', rbs: '', fbs: '', weight: '', height: '', spo2: ''
  });

  // Checkboxes
  const [checkboxes, setCheckboxes] = useState({
    diabetes: false, htn: false, hepatitis: false, asthma: false
  });

  // Notes
  const [notes, setNotes] = useState({
    clinical_history: '', physician_note: '', reports_findings: ''
  });

  // Lists
  const [selectedComplaints, setSelectedComplaints] = useState<any[]>([]);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<any[]>([]);
  const [prescribedMedications, setPrescribedMedications] = useState<any[]>([]);

  // Temporary selection state for adding to lists
  const [currentComplaint, setCurrentComplaint] = useState("");
  const [currentDiagnosis, setCurrentDiagnosis] = useState("");
  const [currentMed, setCurrentMed] = useState({ id: "", dose: "1 Tablet", frequency: "OD (Once a day)", duration: "3 Days" });

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
      setCurrentMed({ id: "", dose: "1 Tablet", frequency: "OD (Once a day)", duration: "3 Days" });
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col h-full print:hidden">
        {/* Vitals Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 sticky top-[73px] z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {Object.keys(vitals).map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-xs text-slate-500 mb-1 uppercase">{key}:</label>
                <Input 
                  className="h-8 bg-slate-50 dark:bg-slate-900 border-slate-200 transition-all focus-visible:ring-emerald-500" 
                  value={(vitals as any)[key]} 
                  onChange={e => setVitals({...vitals, [key]: e.target.value})}
                />
              </div>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 overflow-auto pb-24">
          <Tabs defaultValue="current-visit" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 h-auto gap-2 bg-transparent p-0">
              <TabsTrigger value="current-visit" className="flex flex-col items-start p-4 border border-slate-200 data-[state=active]:border-emerald-500 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/20 transition-all duration-300 rounded-xl justify-center h-full group">
                <span className="flex items-center gap-2 font-bold text-lg text-slate-800 dark:text-slate-100"><span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-300 group-data-[state=active]:border-emerald-500 group-data-[state=active]:text-emerald-500 text-slate-400 text-xs transition-colors duration-300">1</span>Current Visit Plan</span>
                <span className="text-xs text-slate-500 mt-1 font-normal text-left">Presenting Complain, Provisional Diagnosis, Clinical History & Examination.</span>
              </TabsTrigger>
              <TabsTrigger value="advice" className="flex flex-col items-start p-4 border border-slate-200 data-[state=active]:border-amber-500 data-[state=active]:bg-amber-50 dark:data-[state=active]:bg-amber-950/20 transition-all duration-300 rounded-xl justify-center h-full group">
                <span className="flex items-center gap-2 font-bold text-lg text-slate-800 dark:text-slate-100"><span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-300 group-data-[state=active]:border-amber-500 group-data-[state=active]:text-amber-500 text-slate-400 text-xs transition-colors duration-300">2</span>Advice</span>
                <span className="text-xs text-slate-500 mt-1 font-normal text-left">Investigations, Medication & Follow-Up.</span>
              </TabsTrigger>
              <TabsTrigger value="admission" className="flex flex-col items-start p-4 border border-slate-200 data-[state=active]:border-rose-500 data-[state=active]:bg-rose-50 dark:data-[state=active]:bg-rose-950/20 transition-all duration-300 rounded-xl justify-center h-full group">
                <span className="flex items-center gap-2 font-bold text-lg text-slate-800 dark:text-slate-100"><span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-300 group-data-[state=active]:border-rose-500 group-data-[state=active]:text-rose-500 text-slate-400 text-xs transition-colors duration-300">3</span>Admission</span>
                <span className="text-xs text-slate-500 mt-1 font-normal text-left">Create Admission Plan.</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1 animate-in fade-in zoom-in-95 duration-200">
              <TabsContent value="current-visit" className="m-0 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Presenting Complaints:</label>
                        <div className="flex gap-2">
                          <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" value={currentComplaint} onChange={e => setCurrentComplaint(e.target.value)}>
                            <option value="">Select Complaint</option>
                            {masterComplaints.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          <Button type="button" onClick={addComplaint} variant="secondary" className="hover:bg-slate-200 dark:hover:bg-slate-700"><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 min-h-8">
                          {selectedComplaints.map(c => (
                            <div key={c.id} className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-slate-200 transition-all hover:border-rose-200 group">
                              {c.name}
                              <button onClick={() => setSelectedComplaints(selectedComplaints.filter(x => x.id !== c.id))} className="text-slate-400 hover:text-rose-500 group-hover:scale-110 transition-transform">&times;</button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Provisional Diagnosis:</label>
                        <div className="flex gap-2">
                          <select className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" value={currentDiagnosis} onChange={e => setCurrentDiagnosis(e.target.value)}>
                            <option value="">Select Diagnosis</option>
                            {masterDiagnoses.map(d => <option key={d.id} value={d.id}>{d.name} {d.icd10_code ? `(${d.icd10_code})` : ''}</option>)}
                          </select>
                          <Button type="button" onClick={addDiagnosis} variant="secondary" className="hover:bg-slate-200 dark:hover:bg-slate-700"><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 min-h-8">
                          {selectedDiagnoses.map(d => (
                            <div key={d.id} className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-slate-200 transition-all hover:border-rose-200 group">
                              {d.name}
                              <button onClick={() => setSelectedDiagnoses(selectedDiagnoses.filter(x => x.id !== d.id))} className="text-slate-400 hover:text-rose-500 group-hover:scale-110 transition-transform">&times;</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Reports Findings:</label>
                      <Textarea 
                        placeholder="Enter Reports Findings Here!" 
                        className="h-32 focus-visible:ring-emerald-500 transition-shadow" 
                        value={notes.reports_findings}
                        onChange={e => setNotes({...notes, reports_findings: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="flex gap-4 mb-2">
                      {[
                        { id: 'diabetes', label: 'Diabetes' },
                        { id: 'htn', label: 'IHD / HTN' },
                        { id: 'hepatitis', label: 'Hepatitis B/C' },
                        { id: 'asthma', label: 'Asthma/COPD' }
                      ].map((condition) => (
                        <div key={condition.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={condition.id} 
                            checked={(checkboxes as any)[condition.id]}
                            onCheckedChange={checked => setCheckboxes({...checkboxes, [condition.id]: checked as boolean})}
                          />
                          <label htmlFor={condition.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none hover:text-emerald-600 transition-colors">
                            {condition.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Clinical History:</label>
                      <Textarea 
                        placeholder="Enter Clinical History Findings Here!" 
                        className="h-64 focus-visible:ring-emerald-500 transition-shadow" 
                        value={notes.clinical_history}
                        onChange={e => setNotes({...notes, clinical_history: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Physician Note:</label>
                      <Textarea 
                        placeholder="Enter Physician Note Here!" 
                        className="h-32 focus-visible:ring-emerald-500 transition-shadow" 
                        value={notes.physician_note}
                        onChange={e => setNotes({...notes, physician_note: e.target.value})}
                      />
                    </div>
                  </div>

                </div>
              </TabsContent>
              
              <TabsContent value="advice" className="m-0 h-full">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold">Prescribe Medications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-slate-700">Medicine</label>
                      <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" value={currentMed.id} onChange={e => setCurrentMed({...currentMed, id: e.target.value})}>
                        <option value="">Select Medicine</option>
                        {masterMedicines.map(m => <option key={m.id} value={m.id}>{m.name} {m.brand ? `(${m.brand})` : ''}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Dose</label>
                      <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" value={currentMed.dose} onChange={e => setCurrentMed({...currentMed, dose: e.target.value})}>
                        <option value="1 Tablet">1 Tablet</option>
                        <option value="2 Tablets">2 Tablets</option>
                        <option value="1/2 Tablet">1/2 Tablet</option>
                        <option value="1 Teaspoon">1 Teaspoon</option>
                        <option value="2 Teaspoons">2 Teaspoons</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Frequency</label>
                      <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" value={currentMed.frequency} onChange={e => setCurrentMed({...currentMed, frequency: e.target.value})}>
                        <option value="OD (Once a day)">OD (Once a day)</option>
                        <option value="BD (Twice a day)">BD (Twice a day)</option>
                        <option value="TDS (Thrice a day)">TDS (Thrice a day)</option>
                        <option value="QID (Four times a day)">QID (Four times a day)</option>
                        <option value="SOS (As needed)">SOS (As needed)</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium text-slate-700">Duration</label>
                        <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" value={currentMed.duration} onChange={e => setCurrentMed({...currentMed, duration: e.target.value})}>
                          <option value="3 Days">3 Days</option>
                          <option value="5 Days">5 Days</option>
                          <option value="7 Days">7 Days</option>
                          <option value="10 Days">10 Days</option>
                          <option value="14 Days">14 Days</option>
                          <option value="1 Month">1 Month</option>
                        </select>
                      </div>
                      <Button onClick={addMedication} className="h-10 bg-amber-500 hover:bg-amber-600 text-white transition-colors"><Plus className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden mt-6 shadow-sm">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Medicine</th>
                          <th className="px-4 py-3 font-semibold">Dose</th>
                          <th className="px-4 py-3 font-semibold">Frequency</th>
                          <th className="px-4 py-3 font-semibold">Duration</th>
                          <th className="px-4 py-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescribedMedications.length === 0 ? (
                          <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">No medications prescribed yet.</td></tr>
                        ) : (
                          prescribedMedications.map((med, idx) => (
                            <tr key={idx} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 font-medium">{med.name} {med.brand ? <span className="text-slate-400 font-normal">({med.brand})</span> : ''}</td>
                              <td className="px-4 py-3 text-slate-600">{med.dose}</td>
                              <td className="px-4 py-3 text-slate-600">{med.frequency}</td>
                              <td className="px-4 py-3 text-slate-600">{med.duration}</td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="icon" onClick={() => setPrescribedMedications(prescribedMedications.filter((_, i) => i !== idx))} className="text-rose-500 hover:bg-rose-50 h-8 w-8 transition-colors">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="admission" className="m-0 h-full">
                <div className="flex items-center justify-center h-64 text-slate-500 italic">
                  Admission Component will be built here (Future Phase)
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </main>

        {/* Sticky Bottom Action Bar */}
        <footer className="fixed bottom-0 w-full bg-slate-900 text-white p-3 flex justify-between items-center z-20">
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white border-0 gap-2 transition-colors">
              <History className="w-4 h-4" /> View Past Records
            </Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2 transition-colors">
              <FileText className="w-4 h-4" /> Diagnostic Reports
            </Button>
            <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white border-0 gap-2 transition-colors">
              <ImageIcon className="w-4 h-4" /> PACS
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 transition-colors">
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Visit & Mark Completed'}
            </Button>
            <Button onClick={() => window.print()} variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white border-0 gap-2 transition-colors">
              <Printer className="w-4 h-4" /> Print Prescription
            </Button>
          </div>
        </footer>
      </div>

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
            <p className="text-sm">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-sm">Time: {new Date().toLocaleTimeString()}</p>
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
                  <span className="text-sm text-slate-600 mt-1">Take <strong>{m.dose}</strong>, <strong>{m.frequency}</strong> for <strong>{m.duration}</strong>.</span>
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
    </>
  );
}
