"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectList from "@/components/project/ProjectList";
import ProjectModal from "@/components/project/ProjectModal";
import {
  deleteProjectById,
  getProjectsByRole,
} from "@/helpers/projects/server";
import { toast } from "sonner";

export default function ProjectListContainer({ projects, user }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProject, setSelectedProject] = useState(null);
  // const [projectList, setProjectList] = useState(projects);

  const handleOpenModal = (mode, project = null) => {
    setModalMode(mode);
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalMode("create");
    setSelectedProject(null);
  };

  const handleDelete = async (projectId) => {
    toast("¿Eliminar proyecto?", {
      description: "Esta acción no se puede deshacer.",
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await deleteProjectById(projectId);
            const updatedProjects = await getProjectsByRole(user);
            // setProjectList(updatedProjects);

            toast.success("Proyecto eliminado correctamente");
          } catch (error) {
            toast.error("Error al eliminar el proyecto");
            console.error(error);
          }
        },
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        {(user.role === "client" || user.role === "pm") && (
          <Button onClick={() => handleOpenModal("create")}>
            Nuevo Proyecto
          </Button>
        )}
      </div>

      <ProjectList
        projects={projects}
        role={user.role}
        user={user}
        onView={(project) => handleOpenModal("view", project)}
        onEdit={(project) => handleOpenModal("edit", project)}
        onCreate={() => handleOpenModal("create")}
        handleDelete={handleDelete}
      />

      <ProjectModal
        mode={modalMode}
        user={user}
        project={selectedProject}
        open={modalOpen}
        onOpenChange={handleCloseModal}
      />
    </>
  );
}
