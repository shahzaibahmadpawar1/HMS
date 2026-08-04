-- 1. Create a sequence for auto-generating Medical Record Numbers
CREATE SEQUENCE IF NOT EXISTS public.patient_mrn_seq START 1000;

-- 2. Update the patient_mrn column to use the sequence by default
ALTER TABLE public.patients 
  ALTER COLUMN patient_mrn SET DEFAULT 'PT-' || nextval('public.patient_mrn_seq')::text;

-- 3. Add DOB (Date of Birth) column as a true DATE type
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS dob DATE;

-- 4. Split contact info into phone and address
ALTER TABLE public.patients 
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT;

-- 5. Drop the old columns (WARNING: This will drop data in these columns for existing rows)
ALTER TABLE public.patients DROP COLUMN IF EXISTS age_dob;
ALTER TABLE public.patients DROP COLUMN IF EXISTS contact_info;
