"use client";

import Tilt from "react-parallax-tilt";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, FileText, Pencil, Trash } from "lucide-react";

export default function ProjectCard({
  project,
  user,
  onEdit,
  onDelete,
  onView,
}) {
  return (
    <Tilt
      tiltEnable={true}
      glareEnable={true}
      glareMaxOpacity={0.15}
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      glareColor="#0F172A"
      glarePosition="all"
      scale={0.98}
      transitionSpeed={2500}
      className="h-full overflow-hidden rounded-2xl"
    >
      <Card className="relative flex flex-col justify-between h-full min-h-[190px] transition-shadow border border-gray-200 group hover:shadow-lg p-4">
        <div className="absolute z-20 top-2 right-2">
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
              {user.role === "pm" && (
                <>
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
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative z-10 flex-1">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-lg line-clamp-1">
              {project.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description || "Sin descripción"}
            </p>
          </CardHeader>

          <CardContent className="p-0 mt-2 space-y-2">
            {project.files?.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Archivos:
                </p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {project.files.map((file, i) => (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      {file.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </Tilt>
  );
}
