import { ImageResponse } from "next/og"

export const alt = "Grayola — del pedido a la entrega, sin perder el hilo"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const STATUSES = [
  { label: "Pendiente", value: "03", rule: "#56564f" },
  { label: "En progreso", value: "05", rule: "#1f3fd1" },
  { label: "En revisión", value: "02", rule: "#b7790a" },
  { label: "Entregado", value: "12", rule: "#1b7a50" },
]

// Tarjeta Open Graph en el lenguaje de la app: papel, tinta, grilla y los
// contadores por estado como numerales de cartel.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f3f3ef",
        color: "#121212",
        padding: 72,
        backgroundImage: "repeating-linear-gradient(90deg, transparent 0 99px, rgba(18,18,18,0.07) 99px 100px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", flexWrap: "wrap", width: 40, height: 40, gap: 4 }}>
          <div style={{ width: 18, height: 18, background: "#121212" }} />
          <div style={{ width: 18, height: 18 }} />
          <div style={{ width: 18, height: 18, background: "#1f3fd1" }} />
          <div style={{ width: 18, height: 18, background: "#121212" }} />
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>Grayola</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 22, letterSpacing: 3, color: "#56564f", fontWeight: 700 }}>
          GESTIÓN DE PROYECTOS DE DISEÑO
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -2, maxWidth: 900 }}>
          Del pedido a la entrega, sin perder el hilo.
        </div>
      </div>

      <div style={{ display: "flex", gap: 28 }}>
        {STATUSES.map((status) => (
          <div key={status.label} style={{ display: "flex", flexDirection: "column", width: 240 }}>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>{status.value}</div>
            <div
              style={{
                marginTop: 12,
                paddingTop: 8,
                borderTop: `5px solid ${status.rule}`,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {status.label}
            </div>
          </div>
        ))}
      </div>
    </div>,
    size,
  )
}
