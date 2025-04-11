"use client";

import ProjectCard from "./ProjectCard";
import EmptyProjects from "./EmptyProjects";
import { AnimatePresence } from "framer-motion";

export default function ProjectList({
  projects,
  role,
  user,
  onEdit,
  onView,
  onCreate,
  handleDelete,
}) {
  if (!projects?.length)
    return <EmptyProjects onCreate={onCreate} role={role} />;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            user={user}
            showActions={role === "pm"}
            onEdit={() => onEdit(project)}
            onView={() => onView(project)}
            onDelete={() => handleDelete(project.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
