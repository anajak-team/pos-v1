
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://arygfexiyywedvpjyyjz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeWdmZXhpeXl3ZWR2cGp5eWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDcxNjEsImV4cCI6MjA4MjkyMzE2MX0.JbPBNWIDw9fPqMMV2bi9sQZsMd25_1hw22eOueB31M0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
