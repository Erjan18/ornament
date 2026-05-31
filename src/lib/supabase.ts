import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
      patterns: {
        Row: Pattern;
        Insert: Omit<Pattern, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Pattern, 'id' | 'created_at' | 'updated_at'>>;
      };
      pattern_images: {
        Row: PatternImage;
        Insert: Omit<PatternImage, 'id' | 'created_at'>;
        Update: Partial<Omit<PatternImage, 'id' | 'created_at'>>;
      };
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'id' | 'created_at'>;
        Update: Partial<Omit<Favorite, 'id' | 'created_at'>>;
      };
    };
  };
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface Pattern {
  id: string;
  name: string;
  slug: string;
  description: string;
  history: string;
  symbolism: string;
  application: string;
  category_id: string | null;
  image_url: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface PatternImage {
  id: string;
  pattern_id: string;
  image_url: string;
  caption: string;
  sort_order: number;
  created_at: string;
}

export interface Favorite {
  id: string;
  session_id: string;
  pattern_id: string;
  created_at: string;
  pattern?: Pattern;
}
