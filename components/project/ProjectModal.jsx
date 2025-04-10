"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ProjectForm from "./ProjectForm";
import { FileText } from "lucide-react";

export default function ProjectModal({
  mode,
  project,
  user,
  open,
  onOpenChange,
}) {
  const isEdit = mode === "edit";
  const isView = mode === "view";
  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isCreate
              ? "Crear nuevo proyecto"
              : isEdit
              ? "Editar proyecto"
              : "Detalle del proyecto"}
          </DialogTitle>
        </DialogHeader>

        {isView ? (
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6 text-sm text-gray-700">
              <div>
                <p className="text-muted-foreground font-medium">Título</p>
                <p className="text-base">{project.title}</p>
              </div>

              <Separator />

              <div>
                <p className="text-muted-foreground font-medium">Descripción</p>
                <p>{project.description || "Sin descripción"}</p>
              </div>

              {project.files?.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground font-medium mb-2">
                      Archivos
                    </p>
                    <ul className="space-y-1">
                      {project.files.map((file, idx) => (
                        <li key={idx}>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:underline"
                          >
                            <FileText className="w-4 h-4" />
                            {file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
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
