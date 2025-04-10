import { getUserWithRole } from '@/helpers/auth/server';
import { getProjectsByRole } from '@/helpers/projects/server';
import ProjectListClient from '../../components/project/ProjectList.client';

export default async function ProyectosPage() {
  const user = await getUserWithRole();
  const projects = await getProjectsByRole(user);

  return (
    <section className="w-full">
      <ProjectListClient projects={projects} user={user} />
    </section>
  );
}
