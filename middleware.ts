import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
  );
  const path = pathname.slice(1);

  const { data, error } = await supabase
    .from("links")
    .select("url")
    .eq("hash", path)
    .single();

  if (error) {
    console.log(error);
    return NextResponse.error();
  }

  return NextResponse.redirect(new URL(data.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/es:hash(.*)",
};
