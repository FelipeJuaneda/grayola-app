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
import { getDesignersByIds } from "@/helpers/users/server";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/Loading/LoadingContext";
import { motion, AnimatePresence } from "framer-motion";

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
  const [assignedDesigners, setAssignedDesigners] = useState([]);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchAssignedDesigners = async () => {
      if (isView && project.assigned_to?.length) {
        try {
          setIsLoading(true);
          const data = await getDesignersByIds(project.assigned_to);
          setAssignedDesigners(data);
        } catch (error) {
          console.error("Error al cargar diseñadores:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchAssignedDesigners();
  }, [isView, project]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <motion.div
              key="modal-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
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
                <ScrollArea className="h-[60vh] pr-4 mt-4">
                  <div className="space-y-6 text-sm text-gray-700">
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Título
                      </p>
                      <p className="text-base">{project.title}</p>
                    </div>

                    <Separator />

                    <div>
                      <p className="font-medium text-muted-foreground">
                        Descripción
                      </p>
                      <p>{project.description || "Sin descripción"}</p>
                    </div>

                    {project.files?.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="mb-2 font-medium text-muted-foreground">
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

                    {assignedDesigners.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="mb-2 font-medium text-muted-foreground">
                            Diseñadores asignados
                          </p>
                          <ul className="space-y-1">
                            {assignedDesigners.map((designer) => (
                              <li key={designer.id}>
                                {designer.full_name || designer.email}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="mt-4">
                  <ProjectForm
                    initialData={isEdit ? project : null}
                    user={user}
                    onSuccess={() => onOpenChange(false)}
                  />
                </div>
              )}
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
