import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function HomePage() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) redirect("/proyectos");
  redirect("/login");
}
