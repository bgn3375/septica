import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zncmprqcrslguxdhxgyl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuY21wcnFjcnNsZ3V4ZGh4Z3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzQ1MjQsImV4cCI6MjA5MDIxMDUyNH0.OcN_KZvGlbYWVFn4M4bA4vjp75bUH1tWk3H1NpQ811Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function loadPhotos() {
  const { data, error } = await supabase.from("photos").select("alias, data");
  if (error) { console.error("loadPhotos:", error); return {}; }
  return Object.fromEntries((data || []).map(r => [r.alias, r.data]));
}

export async function savePhoto(alias, dataUrl) {
  const { error } = await supabase
    .from("photos")
    .upsert({ alias, data: dataUrl, updated_at: new Date().toISOString() });
  if (error) console.error("savePhoto:", error);
}

export async function syncLocalToSupabase() {
  try {
    const local = JSON.parse(localStorage.getItem("septica_photos") || "{}");
    const entries = Object.entries(local);
    if (entries.length === 0) return;
    const remote = await loadPhotos();
    for (const [alias, data] of entries) {
      if (!remote[alias]) await savePhoto(alias, data);
    }
  } catch (e) { console.error("syncLocalToSupabase:", e); }
}
