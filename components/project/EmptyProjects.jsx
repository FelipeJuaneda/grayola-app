"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui";

export default function EmptyProjects({ onCreate, role = "client" }) {
  const isDesigner = role === "designer";

  return (
    <div className="flex flex-col items-center justify-center mt-12 text-center">
      <div className="flex flex-col items-center mb-4">
        <PlusCircle className="w-12 h-12 text-gray-500" />
        <h2 className="text-xl font-semibold text-muted-foreground">
          {isDesigner
            ? "Sin proyectos asignados"
            : "No hay proyectos disponibles"}
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isDesigner
            ? "Aún no se te asignó ningún proyecto. Volvé más tarde para ver tus asignaciones."
            : "Parece que aún no has creado ningún proyecto. Comenzá creando uno nuevo."}
        </p>
      </div>

      {!isDesigner && (
        <Button
          variant="outline"
          onClick={onCreate}
          className="w-full sm:w-auto"
        >
          Crear Nuevo Proyecto
        </Button>
      )}
    </div>
  );
}
