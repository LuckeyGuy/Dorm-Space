// supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ข้อมูลเชื่อมต่อ Supabase ของโปรเจกต์
const SUPABASE_URL = 'https://auivtzjrgurdrohibexh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1aXZ0empyZ3VyZHJvaGliZXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMDg3NzcsImV4cCI6MjEwNjU4NDc3N30.95xqR45D0g61DGiAbh02AvwhRf9IwEJfmU5j7uIitNY';

// สร้าง Supabase client และส่งออกไปใช้งาน
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);