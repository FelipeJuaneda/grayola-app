"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input, Textarea, Button, Label } from "@/components/ui";
import { createProject, updateProject } from "@/helpers/projects/server";
import {
  uploadFiles,
  deleteFilesFromStorage,
} from "@/helpers/projects/storage";

const formSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
});

export default function ProjectForm({ initialData, user, onSuccess }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState(initialData?.files || []);
  const [filesToDelete, setFilesToDelete] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  });

  const handleRemoveNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = (index) => {
    const file = existingFiles[index];
    setFilesToDelete((prev) => [...prev, file]);
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setUploading(true);

    try {
      let uploadedFiles = [];
      if (newFiles.length > 0) {
        uploadedFiles = await uploadFiles(newFiles, initialData?.id || "tmp");
      }

      const finalFiles = [...existingFiles, ...uploadedFiles];

      const projectData = {
        title: data.title,
        description: data.description,
        files: finalFiles,
      };

      if (isEdit) {
        await updateProject(initialData.id, projectData);
        const pathsToDelete = filesToDelete.map(
          (f) =>
            new URL(f.url).pathname.split(
              "/storage/v1/object/public/projects/"
            )[1]
        );
        await deleteFilesFromStorage(pathsToDelete);
      } else {
        await createProject(projectData, user.id);
      }

      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      {existingFiles.length > 0 && (
        <div>
          <Label>Archivos existentes</Label>
          <ul className="text-sm text-gray-600 space-y-1">
            {existingFiles.map((file, i) => (
              <li key={i} className="flex justify-between items-center">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {file.name}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingFile(i)}
                  className="text-red-500 text-xs ml-2"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <Label htmlFor="files">Archivos nuevos</Label>
        <Input
          id="files"
          type="file"
          multiple
          onChange={(e) => {
            const selected = Array.from(e.target.files);
            setNewFiles((prev) => [...prev, ...selected]);
          }}
        />
        {newFiles.length > 0 && (
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            {newFiles.map((file, index) => (
              <li key={index} className="flex justify-between items-center">
                {file.name}
                <button
                  type="button"
                  onClick={() => handleRemoveNewFile(index)}
                  className="text-red-500 text-xs ml-2"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button type="submit" disabled={uploading} className="w-full mt-5">
        {uploading
          ? "Subiendo..."
          : isEdit
          ? "Guardar Cambios"
          : "Crear Proyecto"}
      </Button>
    </form>
  );
}
