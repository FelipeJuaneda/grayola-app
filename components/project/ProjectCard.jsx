"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, FileText, Pencil, Trash } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  onView,
  showActions,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden group transition-shadow hover:shadow-lg">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-transparent via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <CardHeader className="pb-2 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg line-clamp-1">
                {project.title}
              </CardTitle>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {project.description || "Sin descripción"}
              </p>
            </div>

            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(project)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Ver
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(project)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(project.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2 relative z-10">
          {project.files?.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground font-medium">
                Archivos:
              </p>
              <div className="text-sm flex gap-2 flex-wrap">
                {project.files.map((file, i) => (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      {file.name}
                    </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
