'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProjectList({ role }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setProjects(data)
      setLoading(false)
    }

    fetchProjects()
  }, [])

  if (loading) return <p className="text-center mt-4">Cargando proyectos...</p>
  if (projects.length === 0) return <p className="text-center mt-4">No hay proyectos disponibles.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-gray-600">{project.description}</p>
            <p className="text-sm text-muted-foreground">
              Creado: {new Date(project.created_at).toLocaleDateString()}
            </p>

            {role === 'pm' && (
              <div className="flex gap-2 mt-4">
                <Button variant="secondary">Editar</Button>
                <Button variant="destructive">Eliminar</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
