import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SUITABILITY_RANKS: Record<string, number> = { S1: 4, S2: 3, S3: 2, N: 1 };
const RANK_TO_SUITABILITY: Record<number, string> = { 4: 'S1', 3: 'S2', 2: 'S3', 1: 'N' };

// Helper to check if string is UUID
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

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
    const cropQuery = searchParams.get('crop') || 'padi';
    
    // 1. Fetch Crop and Criteria from Supabase
    let cropQueryBuilder = supabase.from('tanaman').select('*, kriteria_tanaman(*)');
    if (isUUID(cropQuery)) {
      cropQueryBuilder = cropQueryBuilder.eq('id', cropQuery);
    } else {
      cropQueryBuilder = cropQueryBuilder.ilike('nama', `%${cropQuery}%`);
    }
    const { data: cropDb, error: cropError } = await cropQueryBuilder.limit(1).maybeSingle();
    
    if (cropError || !cropDb) {
      return NextResponse.json(
        { error: `Crop '${cropQuery}' is not found in database.` },
        { status: 400 }
      );
    }

    const kriteriaList = cropDb.kriteria_tanaman || [];

    // 2. Retrieve land details from Supabase
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

    // 3. Pull parameter values from DB and query parameters
    const suhu = land.suhu ? Number(land.suhu) : 22.0;
    const curahHujan = land.curah_hujan ? Number(land.curah_hujan) : 120.0;
    const ketinggian = land.ketinggian ? Number(land.ketinggian) : 0;
    const pHVal = parsePH(searchParams.get('pH') || land.pH || '');
    const slopeVal = parseSlope(searchParams.get('slope') || land.slope || '');
    const drainaseVal = land.tipe_drainase || 'Baik';
    const jenisTanahVal = land.jenis_tanah || 'Lempung';

    // 4. Perform dynamic evaluations
    let minRank = 4;
    const details: any = {};
    
    const ratingLabels: Record<string, string> = {
      S1: 'S1 (Sangat Sesuai)',
      S2: 'S2 (Cukup Sesuai)',
      S3: 'S3 (Sesuai Marginal)',
      N: 'N (Tidak Sesuai)'
    };

    for (const criterion of kriteriaList) {
      const { parameter, s1_min, s1_max, s2_min, s2_max, s3_min, s3_max, s1_text, s2_text, s3_text } = criterion;
      
      let val: any = null;
      let label = '';
      let unit = '';
      
      if (parameter === 'temperatur') {
        val = suhu;
        label = 'Suhu';
        unit = ' °C';
      } else if (parameter === 'curah_hujan') {
        val = curahHujan;
        label = 'Curah Hujan';
        unit = ' mm/bln';
      } else if (parameter === 'ketinggian') {
        val = ketinggian;
        label = 'Ketinggian';
        unit = ' mdpl';
      } else if (parameter === 'ph_tanah') {
        val = pHVal;
        label = 'pH Tanah';
        unit = '';
      } else if (parameter === 'lereng') {
        val = slopeVal;
        label = 'Kemiringan Lereng';
        unit = '%';
      } else if (parameter === 'drainase') {
        val = drainaseVal;
        label = 'Drainase';
        unit = '';
      } else if (parameter === 'tekstur_tanah') {
        val = jenisTanahVal;
        label = 'Tekstur Tanah';
        unit = '';
      }
      
      if (val === null || val === undefined) continue;
      
      let rating = 'N';
      const isTextParam = ['drainase', 'tekstur_tanah'].includes(parameter);
      
      if (isTextParam) {
        const valStr = String(val).toLowerCase().trim();
        const normalizeArray = (arr: any) => (Array.isArray(arr) ? arr : []).map((x: any) => String(x).toLowerCase().trim());
        if (normalizeArray(s1_text).includes(valStr)) rating = 'S1';
        else if (normalizeArray(s2_text).includes(valStr)) rating = 'S2';
        else if (normalizeArray(s3_text).includes(valStr)) rating = 'S3';
      } else {
        const numVal = Number(val);
        const matchesRange = (min: any, max: any) => {
          if (min === null || max === null) return false;
          return numVal >= Number(min) && numVal <= Number(max);
        };
        if (matchesRange(s1_min, s1_max)) rating = 'S1';
        else if (matchesRange(s2_min, s2_max)) rating = 'S2';
        else if (matchesRange(s3_min, s3_max)) rating = 'S3';
        else if (s1_min === null && s1_max === null && s2_min === null && s2_max === null && s3_min === null && s3_max === null) {
          rating = 'S1';
        }
      }
      
      const rank = SUITABILITY_RANKS[rating] || 1;
      if (rank < minRank) {
        minRank = rank;
      }
      
      details[parameter] = {
        value: `${val}${unit}`,
        rating,
        label: ratingLabels[rating]
      };
    }

    const overallRating = RANK_TO_SUITABILITY[minRank];

    return NextResponse.json({
      lahanId: id,
      lahanNama: land.nama,
      tanaman: cropDb.nama,
      suitability: {
        class: overallRating,
        label: ratingLabels[overallRating],
        details
      }
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal Server Error: ' + err.message },
      { status: 500 }
    );
  }
}
