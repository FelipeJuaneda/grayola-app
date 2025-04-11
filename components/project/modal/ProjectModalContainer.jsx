"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProjectForm from "./ProjectForm";
import { getDesignersByIds } from "@/helpers/users/server";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/Loading/LoadingContext";
import { motion, AnimatePresence } from "framer-motion";
import View from "./View";

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
          <DialogContent className="w-full max-w-2xl">
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
                <View project={project} assignedDesigners={assignedDesigners} />
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
