import { expect, type Page } from "@playwright/test"

export type DemoRole = "pm" | "client" | "designer"

const DEMO_BUTTON: Record<DemoRole, RegExp> = {
  pm: /^Project Manager/,
  client: /^Cliente/,
  designer: /^Diseño/,
}

const HEADING: Record<DemoRole, RegExp> = {
  pm: /^Proyectos$/,
  client: /^Hola, Lucía$/,
  designer: /^Hola, Sofía$/,
}

// Entra con el acceso de demo del login (misma vía que usa un recruiter).
export async function signInAs(page: Page, role: DemoRole) {
  await page.goto("/login")
  await page.getByRole("button", { name: DEMO_BUTTON[role] }).click()
  await page.waitForURL("**/proyectos")
  await expect(page.getByRole("heading", { level: 1, name: HEADING[role] })).toBeVisible()
}

// Proyectos del seed con dueño conocido.
export const SEED = {
  // cliente1 (Lucía), asignado a Sofía (designer) y Tomás
  rebranding: { id: "b0000000-0000-4000-8000-000000000001", title: "Rebranding Café Brújula" },
  // cliente2 (Martín), sin asignar
  cowork: { id: "b0000000-0000-4000-8000-000000000006", title: "Señalética para cowork" },
  // cliente2 (Martín), asignado solo a Sofía
  informe: { id: "b0000000-0000-4000-8000-000000000004", title: "Informe anual 2026" },
}
