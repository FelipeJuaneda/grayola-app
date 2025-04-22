# Grayola App

Aplicación web construida como prueba técnica para Grayola, enfocada en la gestión de proyectos de diseño.

---

## 🚀 Tecnologías Usadas

- **Next.js 15 (App Router)**
- **Tailwind CSS** + **ShadCN UI**
- **Supabase** (auth + storage + PostgreSQL)
- **React Hook Form** + **Zod**
- **Sonner** para notificaciones
- **Particles.js** para fondo animado visual
- **next-themes** para soporte dark/light
- **Framer Motion** para animaciones suaves y modernas

---

## 📅 Instrucciones para Ejecutar Localmente

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/grayola-app.git
   cd grayola-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear un archivo `.env.local` con las siguientes claves:
   ```env
   NEXT_PUBLIC_SUPABASE_URL= Clavesecreta
   NEXT_PUBLIC_SUPABASE_ANON_KEY= Clavesecreta
   ```

4. **Levantar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 👤 Usuarios de prueba (según rol)

Puedes iniciar sesión con los siguientes usuarios ya cargados en la base de datos para probar los diferentes roles y permisos:

- **Product Manager**
  - Email: `pm@gmail.com`
  - Contraseña: `123456`

- **Clientes**
  - Cliente 1: `cliente1@gmail.com` · Contraseña: `123456`
  - Cliente 2: `cliente2@gmail.com` · Contraseña: `123456`

- **Diseñadores**
  - Diseñador 1: `designer@gmail.com` · Contraseña: `123456`
  - Diseñador 2: `designer2@gmail.com` · Contraseña: `123456`
  - Diseñador 3: `designer3@gmail.com` · Contraseña: `123456`

---

## 📊 Descripción Técnica de la Solución

### 1. 🔐 Autenticación y Roles

- Integración con **Supabase Auth**.
- Sistema de roles: cliente, project_manager (pm), designer, almacenado en la tabla `profiles`.
- Uso de **políticas RLS personalizadas (Policies)** para proteger accesos a proyectos según el rol.
- Middleware en Next.js para redireccionar si el usuario no está logueado.

### 2. ⚒️ Gestor de Proyectos (CRUD)

- Cada proyecto incluye:
  - Título
  - Descripción
  - Archivos subidos (usando `supabase.storage` con URLs firmadas y buckets privados).
- Soporte para **crear, editar, eliminar** proyectos según rol.
- Cliente puede crear proyectos y ver los propios · PM puede ver todos, asignar, editar y eliminar · Diseñador puede ver los asignados sin editar ni borrar.

### 3. 🌟 Interfaz de Usuario

- UI moderna, responsiva y minimalista usando **Tailwind CSS** + **ShadCN UI**.
- Formularios profesionales con validaciones de campos requeridos y tipos usando **Zod**.
- Integración de **React Hook Form** para gestionar formularios.
- **Framer Motion** para animaciones suaves, especialmente en transiciones y modales.

### 4. 🏡 Arquitectura del Proyecto

- Separación clara de responsabilidades:
  - `helpers/` para funciones reutilizables de Supabase (client/server).
  - `components/ui/` para elementos de interfaz reutilizables.
  - `schemas/` para validaciones con Zod.
  - `lib/` para configuración de Supabase.
- Soporte completo para **modo oscuro y claro**.
- Fondo animado con `Particles.js`, adaptado según tema.

### 5. 🚸 Seguridad

- Validaciones con Zod en todos los formularios.
- Autorización basada en roles desde Supabase.
- Protección de rutas y acciones según tipo de usuario.

---

## 🚧 Extras y Bonus

- ✅ Aplicación desplegada en **Vercel** para facilitar la demo: [grayola-app.vercel.app](https://grayola-app.vercel.app)
- ✅ Uso completo de **ShadCN UI** para consistencia visual.
- ✅ Animaciones y detalles visuales cuidados (particles, fuentes tipográficas, layout adaptable).
- ✅ Se documentó todo

---

## 😊 Autor

Construido por Felipe como parte del proceso de selección de Grayola.

> ¡Gracias por leer! Esta app fue construida con pasión, foco en la experiencia de usuario y escalabilidad. ❤️


