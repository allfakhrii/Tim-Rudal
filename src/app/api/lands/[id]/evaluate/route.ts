import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Range {
  min: number;
  max: number;
}

interface CropCriteria {
  nama: string;
  suhu: { S1: Range; S2: Range; S3: Range };
  curahHujan: { S1: Range; S2: Range; S3: Range };
  kelembaban: { S1: Range; S2: Range; S3: Range };
  pH: { S1: Range; S2: Range; S3: Range };
  slope: { S1: Range; S2: Range; S3: Range };
  drainase: {
    s1Values: string[];
    s2Values: string[];
    s3Values: string[];
  };
}

// Crop criteria specifications for Buncis & Wortel
const CROP_CRITERIA_DB: Record<string, CropCriteria> = {
  buncis: {
    nama: 'Buncis',
    suhu: {
      S1: { min: 18, max: 24 },
      S2: { min: 15, max: 27 },
      S3: { min: 12, max: 30 }
    },
    curahHujan: {
      S1: { min: 100, max: 150 },
      S2: { min: 70, max: 200 },
      S3: { min: 50, max: 250 }
    },
    kelembaban: {
      S1: { min: 50, max: 75 },
      S2: { min: 40, max: 85 },
      S3: { min: 30, max: 95 }
    },
    pH: {
      S1: { min: 5.8, max: 6.8 },
      S2: { min: 5.5, max: 7.5 },
      S3: { min: 5.0, max: 8.0 }
    },
    slope: {
      S1: { min: 0, max: 8 },
      S2: { min: 8, max: 15 },
      S3: { min: 15, max: 30 }
    },
    drainase: {
      s1Values: ['Baik', 'Agak Baik'],
      s2Values: ['Agak Cepat', 'Cepat'],
      s3Values: ['Agak Terhambat']
    }
  },
  wortel: {
    nama: 'Wortel',
    suhu: {
      S1: { min: 15, max: 20 },
      S2: { min: 12, max: 23 },
      S3: { min: 9, max: 26 }
    },
    curahHujan: {
      S1: { min: 80, max: 120 },
      S2: { min: 60, max: 160 },
      S3: { min: 40, max: 200 }
    },
    kelembaban: {
      S1: { min: 60, max: 80 },
      S2: { min: 50, max: 90 },
      S3: { min: 45, max: 95 }
    },
    pH: {
      S1: { min: 5.5, max: 6.5 },
      S2: { min: 5.0, max: 7.0 },
      S3: { min: 4.5, max: 7.5 }
    },
    slope: {
      S1: { min: 0, max: 8 },
      S2: { min: 8, max: 15 },
      S3: { min: 15, max: 25 }
    },
    drainase: {
      s1Values: ['Baik', 'Agak Baik'],
      s2Values: ['Agak Cepat'],
      s3Values: ['Cepat', 'Agak Terhambat']
    }
  }
};

// Numeric suitability checker
function checkNumericSuitability(value: number, ranges: { S1: Range; S2: Range; S3: Range }): string {
  if (value >= ranges.S1.min && value <= ranges.S1.max) return 'S1';
  if (value >= ranges.S2.min && value <= ranges.S2.max) return 'S2';
  if (value >= ranges.S3.min && value <= ranges.S3.max) return 'S3';
  return 'N';
}

// Text-based drainage suitability checker
function checkTextSuitability(value: string, criteria: { s1Values: string[]; s2Values: string[]; s3Values: string[] }): string {
  if (criteria.s1Values.includes(value)) return 'S1';
  if (criteria.s2Values.includes(value)) return 'S2';
  if (criteria.s3Values.includes(value)) return 'S3';
  return 'N';
}

const SUITABILITY_RANKS: Record<string, number> = { S1: 4, S2: 3, S3: 2, N: 1 };
const RANK_TO_SUITABILITY: Record<number, string> = { 4: 'S1', 3: 'S2', 2: 'S3', 1: 'N' };

// Parse pH string dropdown to float
function parsePH(phStr: string, defaultVal: number = 6.5): number {
  if (!phStr) return defaultVal;
  if (phStr.includes('< 5.5')) return 5.0;
  if (phStr.includes('5.5 - 6.5')) return 6.0;
  if (phStr.includes('6.5 - 7.5')) return 7.0;
  if (phStr.includes('> 7.5')) return 8.0;
  const num = parseFloat(phStr);
  return isNaN(num) ? defaultVal : num;
}

// Parse slope string dropdown to float percentage
function parseSlope(slopeStr: string, defaultVal: number = 5.0): number {
  if (!slopeStr) return defaultVal;
  if (slopeStr.includes('<3%')) return 1.5;
  if (slopeStr.includes('3-8%')) return 5.5;
  if (slopeStr.includes('8-16%')) return 12.0;
  if (slopeStr.includes('>16%')) return 20.0;
  const num = parseFloat(slopeStr);
  return isNaN(num) ? defaultVal : num;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cropQuery = (searchParams.get('crop') || 'buncis').toLowerCase();
    
    // Validate crop selection
    const cropCriteria = CROP_CRITERIA_DB[cropQuery];
    if (!cropCriteria) {
      return NextResponse.json(
        { error: `Crop '${cropQuery}' is not supported. Supported crops: buncis, wortel` },
        { status: 400 }
      );
    }

    // Retrieve land details from Supabase
    const { data: land, error: dbError } = await supabase
      .from('lahan')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !land) {
      return NextResponse.json(
        { error: 'Lahan sawah tidak ditemukan atau gagal diambil dari database.' },
        { status: 404 }
      );
    }

    // Pull parameter values from DB and optional query parameters (with fallbacks)
    const suhu = land.suhu ? Number(land.suhu) : 22.0;
    const curahHujan = land.curah_hujan ? Number(land.curah_hujan) : 120.0;
    const humidity = searchParams.get('humidity') ? Number(searchParams.get('humidity')) : 65.0; // fallback to 65% if not provided
    
    // Parse pH & Slope values
    const pHVal = parsePH(searchParams.get('pH') || land.pH || '');
    const slopeVal = parseSlope(searchParams.get('slope') || land.slope || '');
    const drainaseVal = land.tipe_drainase || 'Baik';

    // Perform individual suitability assessments
    const suhuRating = checkNumericSuitability(suhu, cropCriteria.suhu);
    const hujanRating = checkNumericSuitability(curahHujan, cropCriteria.curahHujan);
    const humRating = checkNumericSuitability(humidity, cropCriteria.kelembaban);
    const phRating = checkNumericSuitability(pHVal, cropCriteria.pH);
    const slopeRating = checkNumericSuitability(slopeVal, cropCriteria.slope);
    const drainRating = checkTextSuitability(drainaseVal, cropCriteria.drainase);

    // Apply limiting factor law (Hukum Minimum) to calculate overall rating
    const ratings = [suhuRating, hujanRating, humRating, phRating, slopeRating, drainRating];
    let minRank = 4;
    for (const rating of ratings) {
      const rank = SUITABILITY_RANKS[rating] || 1;
      if (rank < minRank) {
        minRank = rank;
      }
    }
    const overallRating = RANK_TO_SUITABILITY[minRank];

    // Build human-readable classification string
    const ratingLabels: Record<string, string> = {
      S1: 'S1 (Sangat Sesuai)',
      S2: 'S2 (Cukup Sesuai)',
      S3: 'S3 (Sesuai Marginal)',
      N: 'N (Tidak Sesuai)'
    };

    return NextResponse.json({
      lahanId: id,
      lahanNama: land.nama,
      tanaman: cropCriteria.nama,
      suitability: {
        class: overallRating,
        label: ratingLabels[overallRating],
        details: {
          suhu: { value: `${suhu} °C`, rating: suhuRating, label: ratingLabels[suhuRating] },
          curahHujan: { value: `${curahHujan} mm/bln`, rating: hujanRating, label: ratingLabels[hujanRating] },
          kelembaban: { value: `${humidity}%`, rating: humRating, label: ratingLabels[humRating] },
          pH: { value: pHVal.toFixed(1), rating: phRating, label: ratingLabels[phRating] },
          slope: { value: `${slopeVal}%`, rating: slopeRating, label: ratingLabels[slopeRating] },
          drainase: { value: drainaseVal, rating: drainRating, label: ratingLabels[drainRating] }
        }
      }
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal Server Error: ' + err.message },
      { status: 500 }
    );
  }
}
