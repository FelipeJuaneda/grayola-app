import { getUserWithRole } from '@/helpers/auth'
import ProjectList from '@/components/project/ProjectList'
import Link from 'next/link'

export default async function ProyectosPage() {
  const user = await getUserWithRole()
  console.log("🚀 ~ ProyectosPage ~ user:", user)


  

  return (
    <section className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>

        {(user.role === 'cliente' || user.role === 'pm') && (
          <Link href="/proyectos/new">
            <button className="bg-black text-white px-4 py-2 rounded">
              Nuevo Proyecto
            </button>
          </Link>
        )}
      </div>

      <ProjectList role={user.role} />
    </section>
  )
}
