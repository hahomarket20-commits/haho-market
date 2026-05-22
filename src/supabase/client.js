import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ylcfzqqjrcmgrnvgmxkr.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsY2Z6cXFqcmNtZ3JudmdteGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NTcwNDksImV4cCI6MjA5NDQzMzA0OX0.iKbiF7WgTPtrqjZg_feI8ZE46fIetgGKRozVlKWWffk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)