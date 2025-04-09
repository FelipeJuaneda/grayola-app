"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectList from "@/components/project/ProjectList";
import ProjectModal from "@/components/project/ProjectModal";

export default function ProjectListClient({ projects, user }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4">
        {(user.role === "cliente" || user.role === "pm") && (
          <Button onClick={() => setModalOpen(true)}>Nuevo Proyecto</Button>
        )}
      </div>

      <ProjectList projects={projects} role={user.role} user={user} />

      <ProjectModal
        mode="create"
        user={user}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
