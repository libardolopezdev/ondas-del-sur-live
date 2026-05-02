import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      settings: {
        Row: {
          id: number
          stream_url: string | null
          fm_frequency: string | null
          facebook_url: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          stream_url?: string | null
          fm_frequency?: string | null
          facebook_url?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          stream_url?: string | null
          fm_frequency?: string | null
          facebook_url?: string | null
          phone?: string | null
          updated_at?: string | null
        }
      }
      shows: {
        Row: {
          id: string
          title: string
          host: string | null
          time_start: string
          time_end: string
          tag: string | null
          is_live: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          host?: string | null
          time_start: string
          time_end: string
          tag?: string | null
          is_live?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          host?: string | null
          time_start?: string
          time_end?: string
          tag?: string | null
          is_live?: boolean | null
          created_at?: string | null
        }
      }
      news: {
        Row: {
          id: string
          title: string
          category: string | null
          date: string | null
          image_url: string | null
          body: string | null
          published: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          category?: string | null
          date?: string | null
          image_url?: string | null
          body?: string | null
          published?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          category?: string | null
          date?: string | null
          image_url?: string | null
          body?: string | null
          published?: boolean | null
          created_at?: string | null
        }
      }
      gallery: {
        Row: {
          id: string
          image_url: string
          caption: string | null
          event_name: string | null
          date: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          image_url: string
          caption?: string | null
          event_name?: string | null
          date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          image_url?: string
          caption?: string | null
          event_name?: string | null
          date?: string | null
          created_at?: string | null
        }
      }
      team: {
        Row: {
          id: string
          name: string
          role: string | null
          show: string | null
          schedule: string | null
          avatar_initials: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          role?: string | null
          show?: string | null
          schedule?: string | null
          avatar_initials?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          role?: string | null
          show?: string | null
          schedule?: string | null
          avatar_initials?: string | null
          created_at?: string | null
        }
      }
    }
  }
}
