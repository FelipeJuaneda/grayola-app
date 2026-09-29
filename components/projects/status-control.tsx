"use client"

import { ChevronDown } from "lucide-react"
import { useOptimistic, useTransition } from "react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateProjectStatus } from "@/features/projects/actions"
import { PROJECT_STATUSES, type ProjectStatus, STATUS_META } from "@/features/projects/constants"
import { cn } from "@/lib/utils"

import { StatusLabel, StatusMarker } from "./status"

// Cambio de estado optimista: se ve al instante y se revierte si el
// servidor (o RLS) lo rechaza.
export function StatusControl({
  projectId,
  projectTitle,
  status,
  className,
}: {
  projectId: string
  projectTitle: string
  status: ProjectStatus
  className?: string
}) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status)
  const [pending, startTransition] = useTransition()

  const change = (value: string) => {
    const next = value as ProjectStatus
    if (next === optimisticStatus) return
    startTransition(async () => {
      setOptimisticStatus(next)
      const result = await updateProjectStatus(projectId, next)
      if (result.ok) {
        toast.success(`Estado actualizado: ${STATUS_META[next].label}`, { description: projectTitle })
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex min-h-9 items-center gap-2 rounded-sm border border-transparent px-2 -mx-2",
          "hover:border-rule data-[state=open]:border-rule-strong",
          pending && "opacity-70",
          className,
        )}
        aria-label={`Estado: ${STATUS_META[optimisticStatus].label}. Cambiar estado de ${projectTitle}`}
      >
        <StatusLabel status={optimisticStatus} />
        <ChevronDown aria-hidden="true" className="size-3.5 text-ink-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Mover a</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={optimisticStatus} onValueChange={change}>
          {PROJECT_STATUSES.map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <StatusMarker status={value} />
              {STATUS_META[value].label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
