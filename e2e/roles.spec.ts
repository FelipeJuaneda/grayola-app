import { expect, test } from "@playwright/test"

import { SEED, signInAs } from "./helpers"

test.describe("sin sesión", () => {
  test("las rutas protegidas redirigen al login", async ({ page }) => {
    await page.goto("/proyectos")
    await expect(page).toHaveURL(/\/login$/)
    await page.goto(`/proyectos/${SEED.rebranding.id}`)
    await expect(page).toHaveURL(/\/login$/)
  })

  test("el login muestra errores en español", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("button", { name: "Ingresar" }).click()
    await expect(page.getByText("Ingresá un correo válido", { exact: false })).toBeVisible()
  })
})

test.describe("Project Manager", () => {
  test.beforeEach(async ({ page }) => signInAs(page, "pm"))

  test("ve todos los proyectos y tiene acciones de gestión", async ({ page }) => {
    await expect(page.getByRole("link", { name: SEED.cowork.title })).toBeVisible()
    await expect(page.getByRole("link", { name: SEED.rebranding.title })).toBeVisible()
    await expect(page.getByRole("link", { name: "Nuevo proyecto" }).first()).toBeVisible()

    await page.getByRole("link", { name: SEED.rebranding.title }).click()
    await expect(page.getByRole("link", { name: "Editar" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Eliminar", exact: true })).toBeVisible()
  })

  test("puede ver el tablero por estado", async ({ page }) => {
    await page.getByRole("button", { name: "Tablero" }).click()
    await expect(page).toHaveURL(/view=board/)
    await expect(page.getByRole("heading", { level: 3, name: "En revisión" })).toBeVisible()
  })
})

test.describe("Cliente", () => {
  test.beforeEach(async ({ page }) => signInAs(page, "client"))

  test("solo ve sus proyectos y no puede gestionarlos", async ({ page }) => {
    await expect(page.getByRole("link", { name: SEED.rebranding.title })).toBeVisible()
    await expect(page.getByRole("link", { name: SEED.cowork.title })).toHaveCount(0)

    await page.getByRole("link", { name: SEED.rebranding.title }).click()
    await expect(page.getByRole("button", { name: "Eliminar", exact: true })).toHaveCount(0)
    await expect(page.getByRole("link", { name: "Editar" })).toHaveCount(0)
    await expect(page.getByRole("button", { name: /Cambiar estado/ })).toHaveCount(0)
  })

  test("un proyecto de otro cliente responde 404", async ({ page }) => {
    await page.goto(`/proyectos/${SEED.cowork.id}`)
    await expect(page.getByRole("heading", { name: "No encontramos esta página" })).toBeVisible()
  })

  test("la edición redirige al detalle", async ({ page }) => {
    await page.goto(`/proyectos/${SEED.rebranding.id}/editar`)
    await expect(page).toHaveURL(new RegExp(`/proyectos/${SEED.rebranding.id}$`))
  })
})

test.describe("Diseño", () => {
  test.beforeEach(async ({ page }) => signInAs(page, "designer"))

  test("ve solo lo asignado y no puede crear", async ({ page }) => {
    await expect(page.getByRole("link", { name: SEED.informe.title })).toBeVisible()
    await expect(page.getByRole("link", { name: SEED.cowork.title })).toHaveCount(0)
    await expect(page.getByRole("link", { name: /Nuevo/ })).toHaveCount(0)

    await page.goto("/proyectos/nuevo")
    await expect(page).toHaveURL(/\/proyectos$/)
  })

  test("puede cambiar el estado de un proyecto asignado", async ({ page }) => {
    await page.goto(`/proyectos/${SEED.informe.id}`)
    const trigger = page.getByRole("button", { name: /Cambiar estado/ })
    await trigger.click()
    await page.getByRole("menuitemradio", { name: "En revisión" }).click()
    await expect(page.getByText("Estado actualizado: En revisión")).toBeVisible()

    // Deja el dato demo como estaba.
    await trigger.click()
    await page.getByRole("menuitemradio", { name: "Entregado" }).click()
    await expect(page.getByText("Estado actualizado: Entregado")).toBeVisible()
  })
})
