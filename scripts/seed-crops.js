const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Memuat Environment Variables dari .env.local di root
const envPath = path.join(__dirname, '..', '.env.local');
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fungsi pembantu untuk memproses rentang angka dan operator
function parseRange(val) {
  if (!val) return { min: null, max: null };
  
  if (Array.isArray(val)) {
    let min = Infinity;
    let max = -Infinity;
    for (const item of val) {
      const parsed = parseRange(item);
      if (parsed.min !== null && parsed.min < min) min = parsed.min;
      if (parsed.max !== null && parsed.max > max) max = parsed.max;
    }
    return {
      min: min === Infinity ? null : min,
      max: max === -Infinity ? null : max
    };
  }
  
  if (typeof val === 'object') {
    if (val.operator) {
      if (val.operator === '<' || val.operator === '<=') {
        return { min: 0, max: val.value };
      }
      if (val.operator === '>' || val.operator === '>=') {
        return { min: val.value, max: 99999 };
      }
    }
    return {
      min: val.min !== undefined ? val.min : null,
      max: val.max !== undefined ? val.max : null
    };
  }
  
  return { min: null, max: null };
}

// 2. Memuat data tanaman dari scripts/crops-seed.json
const seedFilePath = path.join(__dirname, 'crops-seed.json');
if (!fs.existsSync(seedFilePath)) {
  console.error(`Error: Seed file not found at ${seedFilePath}`);
  process.exit(1);
}

const cropsData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));

async function seed() {
  console.log('Starting EcoTani crops database seeding...');
  
  try {
    for (const crop of cropsData) {
      const cropName = crop.komoditas;
      const latinName = crop.nama_latin;
      console.log(`\nProcessing crop: ${cropName} (${latinName || 'N/A'})...`);

      // A. Check if the crop already exists in public.tanaman
      let tanamanId;
      const { data: existingCrops, error: selectError } = await supabase
        .from('tanaman')
        .select('id')
        .eq('nama', cropName);
      
      if (selectError) {
        console.error(`Failed to query existing crop '${cropName}':`, selectError.message);
        continue;
      }

      if (existingCrops && existingCrops.length > 0) {
        tanamanId = existingCrops[0].id;
        console.log(`Crop '${cropName}' already exists with ID: ${tanamanId}. Updating criteria...`);
      } else {
        // Insert new crop
        const { data: insertedCrop, error: insertError } = await supabase
          .from('tanaman')
          .insert({
            nama: cropName,
            nama_latin: latinName,
            kategori: crop.kategori || 'Tanaman Pangan',
            deskripsi: crop.deskripsi || null,
            lama_tanam_hari: crop.masa_tanam_hari || 120,
            potensi_hasil_ton_ha: crop.potensi_hasil_ton_ha || 5,
            harga_per_kg: crop.harga_pasar_per_kg || 5000,
          })
          .select('id')
          .single();

        if (insertError) {
          console.error(`Failed to insert crop '${cropName}':`, insertError.message);
          continue;
        }

        tanamanId = insertedCrop.id;
        console.log(`Created crop '${cropName}' with ID: ${tanamanId}.`);
      }

      // B. Parse & insert/update suitability criteria (kriteria_tanaman)
      const criteriaList = [];
      const paramKeys = ['suhu', 'curah_hujan', 'ph', 'kemiringan', 'tekstur', 'ktk'];

      for (const param of paramKeys) {
        if (!crop[param]) continue;

        const paramVal = crop[param];
        const row = {
          tanaman_id: tanamanId,
          parameter: param,
          bobot: param === 'suhu' || param === 'curah_hujan' || param === 'ph' ? 20 : 10,
        };

        if (param === 'tekstur') {
          row.tekstur_s1 = Array.isArray(paramVal.S1) ? paramVal.S1.join(',') : (paramVal.S1 || '');
          row.tekstur_s2 = Array.isArray(paramVal.S2) ? paramVal.S2.join(',') : (paramVal.S2 || '');
          row.tekstur_s3 = Array.isArray(paramVal.S3) ? paramVal.S3.join(',') : (paramVal.S3 || '');
        } else {
          const s1Range = parseRange(paramVal.S1);
          const s2Range = parseRange(paramVal.S2);
          const s3Range = parseRange(paramVal.S3);

          row.s1_min = s1Range.min;
          row.s1_max = s1Range.max;
          row.s2_min = s2Range.min;
          row.s2_max = s2Range.max;
          row.s3_min = s3Range.min;
          row.s3_max = s3Range.max;
        }

        criteriaList.push(row);
      }

      // C. Bulk upsert criteria for this crop
      if (criteriaList.length > 0) {
        console.log(`Seeding ${criteriaList.length} criteria properties for '${cropName}'...`);
        const { error: upsertError } = await supabase
          .from('kriteria_tanaman')
          .upsert(criteriaList, { onConflict: 'tanaman_id,parameter' });

        if (upsertError) {
          console.error(`Failed to seed criteria for '${cropName}':`, upsertError.message);
        } else {
          console.log(`Successfully seeded all suitability criteria for '${cropName}'.`);
        }
      }
    }
    
    console.log('\n==================================================');
    console.log('EcoTani database seeding process completed!');
    console.log('==================================================');
  } catch (err) {
    console.error('Unhandled exception during seeding:', err.message);
  }
}

seed();
