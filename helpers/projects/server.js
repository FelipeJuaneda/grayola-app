import { createServerSupabaseClient } from "@/lib/supabase-server";

// Obtener proyectos por rol
export const getProjectsByRole = async (user) => {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("projects").select("*");

  if (user.role === "cliente") {
    query = query.eq("created_by", user.id);
  } else if (user.role === "diseñador") {
    query = query.eq("assigned_to", user.id);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};
