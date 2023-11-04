import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
  );
  const { link } = req.query;
  let hash = crypto.randomUUID().toString();
  hash = hash.substring(0, 8);
  hash = "es" + hash;

  const { error } = await supabase.from("links").insert([{ url: link, hash }]);
  if (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
  return res.status(200).json({ hash });
}
