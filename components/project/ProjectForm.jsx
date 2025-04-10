"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input, Textarea, Button, Label } from "@/components/ui";
import { createProject, updateProject } from "@/helpers/projects/server";
import {
  uploadFiles,
  deleteFilesFromStorage,
} from "@/helpers/projects/storage";
import { getDesigners } from "@/helpers/users/server";
import { formSchema } from "@/schemas/form";
import Select from "react-select";
import { useLoading } from "@/context/Loading/LoadingContext";

export default function ProjectForm({ initialData, user, onSuccess }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState(initialData?.files || []);
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [designers, setDesigners] = useState([]);
  const { setIsLoading } = useLoading();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      assigned_to: initialData?.assigned_to || [],
    },
  });

  const selectedDesigners = watch("assigned_to", []);

  useEffect(() => {
    const fetchDesigners = async () => {
      if (user?.role === "pm") {
        try {
          setIsLoading(true);
          const data = await getDesigners();
          setDesigners(data);
        } catch (error) {
          console.error("Error al cargar diseñadores:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchDesigners();
  }, [user]);

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
    console.log("entraaa");
    try {
      setIsLoading(true);
      const uploadedFiles =
        newFiles.length > 0
          ? await uploadFiles(newFiles, initialData?.id || "tmp")
          : [];

      const finalFiles = [...existingFiles, ...uploadedFiles];

      const projectData = {
        title: data.title,
        description: data.description,
        files: finalFiles,
        ...(user.role === "pm" && {
          assigned_to: selectedDesigners, 
        }),
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
      setIsLoading(false);
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

      {user.role === "pm" && (
        <div>
          <Label>Asignar a diseñador/es</Label>
          <Select
            isMulti
            options={designers.map((designer) => ({
              value: designer.id,
              label: designer.full_name || designer.email,
            }))}
            value={designers
              .filter((d) => selectedDesigners?.includes(d.id))
              .map((d) => ({
                value: d.id,
                label: d.full_name || d.email,
              }))}
            onChange={(selected) =>
              setValue(
                "assigned_to",
                selected.map((opt) => opt.value),
                { shouldValidate: true }
              )
            }
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      )}

      {existingFiles.length > 0 && (
        <div>
          <Label>Archivos existentes</Label>
          <ul className="space-y-1 text-sm text-gray-600">
            {existingFiles.map((file, i) => (
              <li key={i} className="flex items-center justify-between">
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
                  className="ml-2 text-xs text-red-500 cursor-pointer"
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
          onChange={(e) =>
            setNewFiles((prev) => [...prev, ...Array.from(e.target.files)])
          }
        />
        {newFiles.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {newFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                {file.name}
                <button
                  type="button"
                  onClick={() => handleRemoveNewFile(index)}
                  className="ml-2 text-xs text-red-500 cursor-pointer"
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
