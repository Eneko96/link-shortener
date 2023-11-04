export default function supabaseInstance() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
  );
  return supabase;
}
