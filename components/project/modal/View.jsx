import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "../../ui/avatar";

const View = ({ project, assignedDesigners }) => {
  return (
    <ScrollArea className="pr-4 mt-4 space-y-6">
      <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2 text-foreground">
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-xs tracking-wide uppercase text-muted-foreground">
              Nombre del proyecto
            </p>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="w-5 h-5 text-primary" />
              {project.title}
            </h3>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-medium tracking-wide uppercase text-muted-foreground">
              Descripción
            </h4>
            <p className="text-sm leading-relaxed text-foreground">
              {project.description || (
                <span className="italic text-muted-foreground">
                  Sin descripción
                </span>
              )}
            </p>
          </div>

          {assignedDesigners.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium tracking-wide uppercase text-muted-foreground">
                Diseñadores asignados
              </h4>
              <ul className="space-y-1">
                {assignedDesigners.map((designer) => (
                  <li
                    key={designer.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Avatar className="w-5 h-5">
                      <AvatarFallback>
                        {designer.full_name?.[0] || "👤"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{designer.full_name || designer.email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {project.files?.length > 0 && (
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium tracking-wide uppercase text-muted-foreground">
                Archivos del proyecto
              </h4>
              <ul className="flex flex-wrap gap-2">
                {project.files.map((file, idx) => (
                  <li key={idx}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border border-border bg-muted hover:bg-accent transition-colors"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default View;
