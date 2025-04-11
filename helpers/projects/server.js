"use server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";

// Obtener proyectos por rol
export const getProjectsByRole = async (user) => {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("projects").select("*");

  if (user.role === "client") {
    query = query.eq("created_by", user.id);
  } else if (user.role === "designer") {
    query = query.contains("assigned_to", [user.id]);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// Crear proyecto
export const createProject = async (data) => {
  const supabase = await createServerSupabaseClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("projects").insert({
    ...data,
    created_by: user.id,
    created_at: new Date(),
  });

  if (error) throw new Error(error.message);
  return true;
};

// Actualizar proyecto
export const updateProject = async (id, data) => {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("projects")
    .update({
      ...data,
      updated_at: new Date(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};

// // Eliminar proyecto
export const deleteProjectById = async (id) => {
  const supabase = await createServerSupabaseClient({ cookies });

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
};
