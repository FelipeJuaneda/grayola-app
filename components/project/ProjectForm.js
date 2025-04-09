"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Input,
  Textarea,
  Button,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  createProject,
  updateProject,
  uploadFiles,
} from "@/helpers/projects/client";

const formSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  files: z.any().optional(),
});

export default function ProjectForm({ initialData, user, onSuccess }) {
  console.log("🚀 ~ ProjectForm ~ user:", user);
  const isEdit = !!initialData;
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

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

  const onSubmit = async (data) => {
    setUploading(true);

    let uploadedFiles = [];
    if (data.files && data.files.length > 0) {
      uploadedFiles = await uploadFiles(data.files);
    }

    const projectData = {
      title: data.title,
      description: data.description,
      files: uploadedFiles.length ? uploadedFiles : initialData?.files || [],
    };

    try {
      if (isEdit) {
        await updateProject(initialData.id, projectData);
      } else {
        await createProject(projectData, user.id);
      }

      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? "Editar Proyecto" : "Nuevo Proyecto"}</CardTitle>
      </CardHeader>
      <CardContent>
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

          <div>
            <Label htmlFor="files">Archivos</Label>
            <Input id="files" type="file" multiple {...register("files")} />
          </div>

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading
              ? "Subiendo..."
              : isEdit
              ? "Guardar Cambios"
              : "Crear Proyecto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
