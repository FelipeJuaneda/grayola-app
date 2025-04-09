import { getUserWithRole } from '@/helpers/auth'
import { redirect } from 'next/navigation'

export default async function ProyectosLayout({ children }) {
  const user = await getUserWithRole()
  console.log("🚀 ~ ProyectosLayout ~ user:", user)

  // if (!user) redirect('/login')
  

  return (
    <div>
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="font-bold">Grayola</h1>
        <div className="text-sm text-gray-600">
          {user?.full_name || user?.email} | Rol: <strong>{user?.role}</strong>
        </div>
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}


