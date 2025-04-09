import { getUserWithRole } from '@/helpers/auth';
import { getProjectsByRole } from '@/helpers/projects/server';
import ProjectListClient from './ProjectList.client';

export default async function ProyectosPage() {
  const user = await getUserWithRole();
  const projects = await getProjectsByRole(user);

  return (
    <section className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Proyectos</h1>
      <ProjectListClient projects={projects} user={user} />
    </section>
  );
}
