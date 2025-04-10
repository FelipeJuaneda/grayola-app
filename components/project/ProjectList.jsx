"use client";

import { useState } from "react";
import ProjectModal from "./ProjectModal";
import ProjectCard from "./ProjectCard";
import { toast } from "sonner";
import { deleteProjectById } from "@/helpers/projects/server";

export default function ProjectList({ projects, role, user }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenModal = (mode, project) => {
    setModalMode(mode);
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleDelete = async (projectId) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este proyecto?");
    if (!confirm) return;

    try {
      await deleteProjectById(projectId);
      toast.success("Proyecto eliminado");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error("Error al eliminar el proyecto");
      console.error(err.message);
    }
  };

  if (!projects?.length) {
    return (
      <p className="text-center text-muted-foreground mt-8">
        No hay proyectos disponibles.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            user={user}
            showActions={role === "pm"}
            onEdit={() => handleOpenModal("edit", project)}
            onDelete={() => handleDelete(project.id)}
            onView={() => handleOpenModal("view", project)}
          />
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
