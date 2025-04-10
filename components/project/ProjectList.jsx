"use client";

import ProjectCard from "./ProjectCard";
import EmptyProjects from "./EmptyProjects";

export default function ProjectList({
  projects,
  role,
  user,
  onEdit,
  onView,
  onCreate,
  handleDelete,
}) {
  console.log("🚀 ~ role:", role);
  if (!projects?.length)
    return <EmptyProjects onCreate={onCreate} role={role} />;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
