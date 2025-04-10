"use server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

//Obtener usuario con rol
export async function getUserWithRole() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    ...user,
    full_name: profile.full_name,
    role: profile.role,
  };
}

// Obtener diseñadores
export const getDesigners = async () => {
  const supabase = await createServerSupabaseClient();
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "designer");

    if (error) {
      console.error("Error al obtener diseñadores:", error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error al obtener diseñadores:", error);
    throw new Error("No se pudieron obtener los diseñadores");
  }
};

// Obtener diseñadores por su id
export const getDesignersByIds = async (ids) => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", ids);

  if (error) {
    console.error("Error al obtener diseñadores asignados:", error.message);
    return [];
  }

  return data;
};
