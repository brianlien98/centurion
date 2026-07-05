import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('CENTURION_PORTAL_BUILD_ERROR: Missing Supabase environment variables.');
}

// 建立強制隔離指向 centurion_web schema 的客戶端
export const supabaseCenturion = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });

// 定義 TypeScript 介面以確保靜態編譯無誤
export interface WallOfFameItem {
  id: string;
  year: string;
  brand: string;
  founder: string | null;
  category: 'artist-ip' | 'media' | 'brand-retail' | 'culture';
  type: string;
  description: string | null;
}

export interface PartnershipLeadInput {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  business_area: string;
  timeframe: string;
  proposal_summary: string;
}