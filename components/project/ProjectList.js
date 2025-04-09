"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProjectModal from "./ProjectModal";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
// import { deleteProjectById } from "@/helpers/projects";

export default function ProjectList({ projects, role, user }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // 'view' | 'edit'
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // para mejorar UX en futuro

  const handleOpenModal = (mode, project) => {
    setModalMode(mode);
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleDelete = async (projectId) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este proyecto?");
    if (!confirm) return;

    try {
      // await deleteProjectById(projectId);
      toast.success("Proyecto eliminado");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error("Error al eliminar proyecto");
      console.error(err.message);
    }
  };

  if (!projects?.length) {
    return (
      <p className="text-center text-muted-foreground">
        No hay proyectos disponibles.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {project.description || "Sin descripción"}
              </p>

              {project.files?.length > 0 && (
                <ul className="text-xs mb-2">
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
              )}

              <div className="flex gap-2 mt-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal("view", project)}
                >
                  Ver
                </Button>

                {role === "pm" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleOpenModal("edit", project)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project.id)}
                    >
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal
          mode={modalMode}
          user={user}
          project={selectedProject}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </>
  );
}
