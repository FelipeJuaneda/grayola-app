"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProjectForm from "./ProjectForm";

export default function ProjectModal({
  mode,
  project,
  user,
  open,
  onOpenChange,
}) {
  const isEdit = mode === "edit";
  const isView = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Crear nuevo proyecto"
              : mode === "edit"
              ? "Editar proyecto"
              : "Detalle del proyecto"}
          </DialogTitle>
        </DialogHeader>

        {isView ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground font-semibold">
                Título:
              </p>
              <p>{project.title}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground font-semibold">
                Descripción:
              </p>
              <p>{project.description || "Sin descripción"}</p>
            </div>

            {project.files?.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground font-semibold">
                  Archivos:
                </p>
                <ul className="text-sm list-disc list-inside">
                  {project.files.map((file, idx) => (
                    <li key={idx}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {file.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <ProjectForm
            initialData={isEdit ? project : null}
            user={user}
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
