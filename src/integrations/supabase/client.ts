// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://dxrsnmocbdwlpmobhbnk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cnNubW9jYmR3bHBtb2JoYm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzODI5NzcsImV4cCI6MjA0Nzk1ODk3N30.LURrmPScvs2i_GwzDvxUIvZZkPsK4qFGn6Wr4DVEEnw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);