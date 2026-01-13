
import { createClient } from '@supabase/supabase-js';

// Prioritize environment variables, fallback to demo credentials
// Use safe access pattern for import.meta.env
const meta = import.meta as any;
const SUPABASE_URL = meta.env?.VITE_SUPABASE_URL || 'https://arygfexiyywedvpjyyjz.supabase.co';
const SUPABASE_KEY = meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeWdmZXhpeXl3ZWR2cGp5eWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDcxNjEsImV4cCI6MjA4MjkyMzE2MX0.JbPBNWIDw9fPqMMV2bi9sQZsMd25_1hw22eOueB31M0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
