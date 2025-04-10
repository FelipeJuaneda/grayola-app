import { supabase } from "@/lib/supabase-client";

export const uploadFiles = async (files, projectId) => {
  const uploadedFiles = [];

  for (const file of files) {
    const filePath = `projects/${projectId}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("projects")
      .upload(filePath, file);

    if (error) {
      console.error("❌ Error al subir archivo:", error.message);
      continue;
    }

    const publicUrl = supabase.storage.from("projects").getPublicUrl(filePath)
      .data.publicUrl;

    uploadedFiles.push({
      name: file.name,
      url: publicUrl,
    });
  }

  return uploadedFiles;
};

export const deleteFilesFromStorage = async (filePaths = []) => {
  if (!filePaths.length) return;

  const { error } = await supabase.storage.from("projects").remove(filePaths);

  if (error) {
    console.error("❌ Error al eliminar archivos:", error.message);
  }
};
