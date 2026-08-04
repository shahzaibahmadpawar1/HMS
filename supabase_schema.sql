-- Create custom users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_plain TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert a default doctor
INSERT INTO public.users (username, password_plain) VALUES ('doctor', 'admin123') ON CONFLICT DO NOTHING;

-- Patients table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_mrn TEXT UNIQUE, -- Medical Record Number, e.g., "241116692"
    name TEXT NOT NULL,
    age_dob TEXT,
    gender TEXT,
    contact_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Master Data Tables
CREATE TABLE IF NOT EXISTS public.master_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.master_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    icd10_code TEXT
);

CREATE TABLE IF NOT EXISTS public.master_medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    brand TEXT
);

CREATE TABLE IF NOT EXISTS public.master_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    default_price NUMERIC DEFAULT 0
);

-- Insert some dummy master data for initial testing
INSERT INTO public.master_complaints (name) VALUES ('Headache'), ('Fever'), ('Cough') ON CONFLICT DO NOTHING;
INSERT INTO public.master_diagnoses (name, icd10_code) VALUES ('Common Cold', 'J00'), ('Migraine', 'G43') ON CONFLICT DO NOTHING;
INSERT INTO public.master_medicines (name, brand) VALUES ('Paracetamol 500mg', 'Panadol'), ('Amoxicillin 250mg', 'Amoxil') ON CONFLICT DO NOTHING;
INSERT INTO public.master_services (name, default_price) VALUES ('CBC', 500), ('X-Ray Chest', 1000) ON CONFLICT DO NOTHING;


-- Visits (Consultations) table
CREATE TABLE IF NOT EXISTS public.visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.users(id),
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'completed',
    
    -- Vitals
    temp TEXT,
    bp TEXT,
    pulse TEXT,
    respiratory_rate TEXT,
    rbs TEXT,
    fbs TEXT,
    weight TEXT,
    height TEXT,
    spo2 TEXT,
    vital_time TEXT,
    
    -- Checkboxes (Chronic Conditions)
    has_diabetes BOOLEAN DEFAULT false,
    has_ihd_htn BOOLEAN DEFAULT false,
    has_hepatitis BOOLEAN DEFAULT false,
    has_asthma BOOLEAN DEFAULT false,
    
    -- Notes
    clinical_history TEXT,
    physician_note TEXT,
    reports_findings TEXT,
    advice_instructions TEXT,
    referred_to TEXT,
    
    -- Follow-up
    next_visit_days TEXT,
    next_visit_frequency TEXT,
    next_visit_date DATE
);

-- Link tables for arrays of data in a visit
CREATE TABLE IF NOT EXISTS public.visit_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
    complaint_id UUID REFERENCES public.master_complaints(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS public.visit_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
    diagnosis_id UUID REFERENCES public.master_diagnoses(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS public.visit_investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.master_services(id) ON DELETE RESTRICT,
    performing_location TEXT,
    price NUMERIC
);

CREATE TABLE IF NOT EXISTS public.visit_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES public.master_medicines(id) ON DELETE RESTRICT,
    dose TEXT,
    frequency TEXT,
    when_to_take TEXT,
    duration_days TEXT,
    notes TEXT
);

-- Allow anonymous access for this phase since we are doing custom auth on Next.js side,
-- or rather disable RLS for simplicity since we aren't using Supabase Auth.
-- Alternatively, just enable RLS and add a policy to allow all (for development).
-- Here we just keep RLS disabled by default (which means all access is allowed if anon key is used).
