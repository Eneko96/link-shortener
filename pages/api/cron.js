export default function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
  );

  const anonDeleteResult = supabase
    .from("your_table")
    .delete()
    .eq("id_user", "anon")
    .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  console.log('Deleted records for "anon" users:', anonDeleteResult);

  const identifierDeleteResult = supabase
    .from("your_table")
    .delete()
    .not("id_user", "eq", "anon")
    .lt(
      "created_at",
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    );

  console.log("Deleted records for identifier users:", identifierDeleteResult);
}
