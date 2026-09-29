import type { Role } from "@/lib/auth/session"

export const ROLE_LABEL: Record<Role, string> = {
  client: "Cliente",
  designer: "Diseño",
  pm: "Project Manager",
}

export const DASHBOARD_COPY: Record<Role, { kicker: string; title: (name: string) => string; lead: string }> = {
  client: {
    kicker: "Tus pedidos",
    title: (name) => `Hola, ${name}`,
    lead: "Seguí en qué etapa está cada pedido y quién lo está trabajando.",
  },
  designer: {
    kicker: "Tu trabajo",
    title: (name) => `Hola, ${name}`,
    lead: "Tus proyectos asignados, ordenados por fecha de entrega.",
  },
  pm: {
    kicker: "Panel del estudio",
    title: () => "Proyectos",
    lead: "Todo lo que entra, quién lo tiene y qué vence primero.",
  },
}

export function firstName(fullName: string | null, email: string) {
  return fullName?.trim().split(/\s+/)[0] ?? email.split("@")[0] ?? ""
}
