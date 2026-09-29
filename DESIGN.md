# Design

Sistema visual de Grayola: **Grilla Suiza** (Estilo Tipográfico Internacional). La grilla y la tipografía son la estructura; el color es una señal de estado. Fuente de verdad en código: `app/globals.css` (tokens) y `components/ui/*` (primitivas).

## Principios

1. **Filetes y aire, no cajas.** Las secciones se separan con reglas (1–2 px) y espacio; nada de cards dentro de cards, glassmorphism ni gradientes decorativos.
2. **El color es información.** Papel y tinta para todo; cobalto, ámbar y verde solo marcan estados. El texto queda acromático para garantizar contraste.
3. **Nunca solo color.** Cada estado tiene forma propia: contorno (pendiente), lleno (en progreso), rayado (en revisión), lleno con tilde (entregado).
4. **La ausencia se diseña.** Contadores en cero y etapas no alcanzadas se muestran "apagados"; los vacíos tienen su propia composición sobre la grilla.
5. **Todo control tiene rótulo.** Ningún botón es solo un ícono sin nombre visible o accesible.

## Tokens de color

Contraste medido contra el fondo del tema (WCAG 2.2).

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--paper` | `#f3f3ef` | `#0f0f0e` | Fondo |
| `--surface` | `#ffffff` | `#191917` | Campos, menús, diálogos |
| `--subtle` | `#e8e8e2` | `#232321` | Hover, esqueletos |
| `--ink` | `#121212` (16.8:1) | `#ededE8` (16.3:1) | Texto, botón primario |
| `--ink-2` | `#56564f` (6.6:1) | `#a2a29a` (7.5:1) | Texto secundario |
| `--ink-3` | `#8c8c84` (3.05:1) | `#6b6b64` (3.6:1) | Solo no-texto: bordes de campos, numerales apagados |
| `--rule` | `#d4d4cc` | `#2e2e2b` | Filetes decorativos |
| `--signal-progress` | `#1f3fd1` (7.0:1) | `#7c8fff` (6.6:1) | En progreso, foco, enlaces |
| `--signal-review` / `-ink` | `#b7790a` / `#8a5a00` (5.3:1) | `#f0b43a` (10.3:1) | En revisión |
| `--signal-done` | `#1b7a50` (4.8:1) | `#43c08a` (8.4:1) | Entregado |
| `--danger` | `#b42318` (5.9:1) | `#ff7a6b` (7.5:1) | Errores, vencidos, borrar |

## Tipografía

**Archivo** (variable, ejes de peso y ancho) para todo: texto a ancho normal y numerales "de cartel" expandidos (`.numeral`: `font-stretch: 118%`, peso 750, cifras tabulares).

| Token | Tamaño / interlineado | Uso |
|---|---|---|
| `text-caption` | 12 / 16 | Metadatos, `.kicker` (versalitas con tracking) |
| `text-small` | 13 / 20 | Tablas, botones, etiquetas |
| `text-body` | 15 / 24 | Texto base |
| `text-lead` | 17 / 26 | Bajadas, títulos de fila |
| `text-h3` · `h2` · `h1` | 20 · 24 · 32 | Jerarquía de secciones |
| `text-display` | 44 | Títulos de página (≥ md) |
| `text-numeral` | 64 | Contadores |

## Forma, espacio y capas

- **Radios:** 1, 2, 3, 4 px. Esquinas casi rectas en todo.
- **Espaciado:** base de 4 px (escala de Tailwind); contenedor `container-swiss` con márgenes 16/32/48 px y máximo de 1440 px.
- **Grilla:** 12 columnas; `.grid-rules` las dibuja como filetes en bandas puntuales (auth, vacíos).
- **Sombras:** solo capas flotantes (`--shadow-overlay`).
- **z-index:** partículas 0 · contenido 1 · header 30 · menús 40 · overlay 50 · modal 60 · toasts 70.
- **Breakpoints:** 480 · 640 · 768 · 1024 · 1440 px. La tabla pasa a columnas desde 1024.
- **Objetivos táctiles:** 44 px por defecto; los controles de 36 px extienden su área de toque a 44.

## Movimiento

- Duraciones `--duration-fast/base/slow`: 120 / 200 / 320 ms. Curva `--ease-out-swiss`: `cubic-bezier(.2,.8,.2,1)`.
- Entradas de filas escalonadas (`animate-rise`), aperturas de menús y diálogos, cambio de tema.
- `prefers-reduced-motion`: se respetan todas las animaciones (utilidades `motion-safe`/`motion-reduce` y `MotionConfig reducedMotion="user"`).

## Fondo de partículas (`ParticleField`)

Variante **"Ruta"**: nodos cuadrados que se enlazan como la ruta cliente → PM → diseño; uno de cada cuatro en cobalto marca rutas activas y, en la versión *hero*, el cursor "toma" las conexiones cercanas.

- `intensity="hero"` (auth) · `intensity="ambient"` (banda del dashboard, enmascarada hacia el texto).
- Colores desde tokens `--particle-*`; el tema oscuro aplica `--particle-filter` con transición CSS sobre la misma instancia (sin reinicio ni parpadeo).
- Carga diferida sin SSR, 60/30 fps según intensidad, menos partículas bajo 768 px, pausa con la pestaña oculta o fuera de viewport, `aria-hidden`, `pointer-events: none`, versión estática con movimiento reducido.

## Componentes clave

`Button` (primary/secondary/ghost/danger/link) · `Field` (label + control + ayuda + error enlazados) · `StatusMarker`, `StatusLabel`, `StatusTrack`, `StatusSteps` · `StatusControl` (cambio optimista) · `StatCounters` · `ProjectTable` / `ProjectBoard` · `FileDropzone` / `FileManager` · `AssigneePicker` · `ActivityTimeline` · `EmptyState`.
