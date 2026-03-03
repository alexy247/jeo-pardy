import { createClient } from '@supabase/supabase-js'

// process.env.REACT_APP_SUPABASE_URL;
const supabaseUrl = 'https://bkuvccrswxaycsowlenx.supabase.co';

// process.env.REACT_APP_SUPABASE_ANON_KEY; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrdXZjY3Jzd3hheWNzb3dsZW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDQyNDIsImV4cCI6MjA4NDA4MDI0Mn0.c78OAL-ibfffT2p-KTl13qkKAjQb_SM-5OEOrtWHwPY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  }
})