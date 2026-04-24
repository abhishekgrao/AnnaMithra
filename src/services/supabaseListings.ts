import { supabase } from '../lib/supabase';

export interface Listing {
  id: string;
  title: string;
  category: string;
  quantity: string;
  source: string;
  expiry_days: number;
  urgency_score: number;
  latitude: number | null;
  longitude: number | null;
  type: 'supermarket' | 'dining' | 'donation';
  created_at: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  allergens?: string;
  nutrition_source?: string;
}

export const fetchListings = async (): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
  return data as Listing[];
};
