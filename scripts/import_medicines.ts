import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importMedicines() {
  const filePath = path.join(process.cwd(), 'medicines_list.txt');
  
  if (!fs.existsSync(filePath)) {
    console.error("File medicines_list.txt not found. Please create it in the root folder.");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim() !== '');

  const medicinesToInsert = lines.map(line => {
    // The format seems to be "TYPE. NAME"
    // We'll just store the whole line as the name for now, or you can adjust parsing logic
    return { name: line.trim() };
  });

  console.log(`Found ${medicinesToInsert.length} medicines to import.`);

  // Insert in batches of 1000 to avoid hitting payload limits
  const batchSize = 1000;
  for (let i = 0; i < medicinesToInsert.length; i += batchSize) {
    const batch = medicinesToInsert.slice(i, i + batchSize);
    // Use upsert with ignoreDuplicates so one duplicate doesn't fail the whole batch
    const { error } = await supabase.from('master_medicines').upsert(batch, { onConflict: 'name', ignoreDuplicates: true });
    
    if (error) {
      console.error(`Error inserting batch ${i} to ${i + batchSize}:`, error.message);
    } else {
      console.log(`Successfully processed batch ${i} to ${i + batchSize}`);
    }
  }

  console.log("Import completed!");
}

importMedicines();
