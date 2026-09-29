import { expect, test } from "@playwright/test"

import { signInAs } from "./helpers"

// Recorrido completo entre roles: el cliente pide, el PM asigna, el diseñador
// lo ve y el PM lo elimina (limpia el dato de prueba).
test("pedido → asignación → visibilidad para diseño → borrado", async ({ browser }) => {
  const title = `E2E pedido ${Date.now()}`

  const client = await browser.newPage()
  await signInAs(client, "client")
  await client.getByRole("link", { name: "Nuevo pedido" }).first().click()
  await client.getByRole("textbox", { name: /Título/ }).fill(title)
  await client.getByRole("textbox", { name: /Descripción/ }).fill("Creado por la suite E2E.")
  await client.getByRole("button", { name: "Crear proyecto" }).click()
  await expect(client.getByRole("heading", { level: 1, name: title })).toBeVisible()
  const projectUrl = client.url()
  await client.close()

  const pm = await browser.newPage()
  await signInAs(pm, "pm")
  await pm.goto(`${projectUrl}/editar`)
  await pm.getByRole("button", { name: "Diseñadores asignados" }).click()
  await pm.locator("label", { hasText: "Sofía Acosta" }).click()
  await expect(pm.getByRole("checkbox", { name: /Sofía Acosta/ })).toBeChecked()
  await pm.keyboard.press("Escape")
  await pm.getByRole("button", { name: "Guardar cambios" }).click()
  await expect(pm.getByText("Cambios guardados.")).toBeVisible()

  const designer = await browser.newPage()
  await signInAs(designer, "designer")
  await expect(designer.getByRole("link", { name: title })).toBeVisible()
  await designer.close()

  await pm.goto(projectUrl)
  await pm.getByRole("button", { name: "Eliminar", exact: true }).click()
  await pm.getByRole("button", { name: "Eliminar proyecto" }).click()
  await expect(pm).toHaveURL(/\/proyectos$/)
  await expect(pm.getByRole("link", { name: title })).toHaveCount(0)
  await pm.close()
})
