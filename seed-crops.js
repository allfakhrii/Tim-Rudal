const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually parse .env.local file to load credentials in Node environment
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const parts = trimmedLine.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
      }
    }
  });
}

// 2. Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. Load Crops Seed JSON
const seedFilePath = path.join(__dirname, 'crops-seed.json');
if (!fs.existsSync(seedFilePath)) {
  console.error(`Error: Seed file not found at ${seedFilePath}`);
  process.exit(1);
}

const cropsData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));

// 4. Seeder Execution Function
async function seed() {
  console.log('Starting crops seeding process...');

  try {
    for (const crop of cropsData) {
      console.log(`Seeding crop: ${crop.nama}...`);

      // A. Insert into 'tanaman' table
      const { data: tanamanData, error: tanamanError } = await supabase
        .from('tanaman')
        .insert([
          {
            nama: crop.nama,
            siklus_tanam_days: crop.siklus_tanam_days
          }
        ])
        .select();

      if (tanamanError) {
        console.error(`Error inserting crop '${crop.nama}':`, tanamanError.message);
        continue;
      }

      if (!tanamanData || tanamanData.length === 0) {
        console.error(`Error: No data returned after inserting crop '${crop.nama}'`);
        continue;
      }

      const tanamanId = tanamanData[0].id;
      console.log(`Created crop record '${crop.nama}' with ID: ${tanamanId}`);

      // B. Map and insert criteria parameters into 'kriteria_tanaman' table
      const criteriaRows = crop.kriteria.map(criteria => ({
        tanaman_id: tanamanId,
        parameter: criteria.parameter,
        s1_min: criteria.s1_min,
        s1_max: criteria.s1_max,
        s2_min: criteria.s2_min,
        s2_max: criteria.s2_max,
        s3_min: criteria.s3_min,
        s3_max: criteria.s3_max
      }));

      console.log(`Inserting ${criteriaRows.length} criteria rules for '${crop.nama}'...`);
      const { error: criteriaError } = await supabase
        .from('kriteria_tanaman')
        .insert(criteriaRows);

      if (criteriaError) {
        console.error(`Error seeding criteria for '${crop.nama}':`, criteriaError.message);
      } else {
        console.log(`Successfully seeded [${crop.nama}] and all its crop criteria tiers.`);
      }
      console.log('--------------------------------------------------');
    }

    console.log('Crops database seeding completed successfully!');
  } catch (err) {
    console.error('Seeding process encountered an unhandled exception:', err.message);
  }
}

// Run the seeder
seed();
