import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
  );
  const { hash } = req.query;

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("hash", hash)
    .single();

  if (error) {
    return res.status(500).json({ error });
  }

  res.status(301).redirect(data.url);
}
