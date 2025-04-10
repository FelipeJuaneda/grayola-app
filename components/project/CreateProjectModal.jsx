"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProjectForm from "./ProjectForm";

export default function CreateProjectModal({ user }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nuevo Proyecto</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear nuevo proyecto</DialogTitle>
        </DialogHeader>

        <ProjectForm onSuccess={handleClose} user={user} />
      </DialogContent>
    </Dialog>
  );
}
