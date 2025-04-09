import { supabase } from "@/lib/supabase";

// // Crear proyecto
export const createProject = async (data, userId) => {
  const { error } = await supabase.from("projects").insert({
    ...data,
    created_by: userId,
    created_at: new Date(),
  });

  if (error) throw new Error(error.message);
  return true;
};

// Actualizar proyecto
export const updateProject = async (id, data) => {
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
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
};

// Subir archivos a Supabase
export const uploadFiles = async (files) => {
  const uploadedFiles = [];

  for (const file of files) {
    const { data, error } = await supabase.storage
      .from("projects")
      .upload(`${Date.now()}-${file.name}`, file);

    if (error) {
      console.error("Error al subir archivo:", error.message);
      continue;
    }

    const publicUrl = supabase.storage.from("projects").getPublicUrl(data.path)
      .data.publicUrl;

    uploadedFiles.push({
      name: file.name,
      url: publicUrl,
    });
  }

  return uploadedFiles;
};
