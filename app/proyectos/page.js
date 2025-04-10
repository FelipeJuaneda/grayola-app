import { getUserWithRole } from "@/helpers/users/server";
import { getProjectsByRole } from "@/helpers/projects/server";
import ProjectListClient from "../../components/project/ProjectListContainer";

export default async function ProyectosPage() {
  const user = await getUserWithRole();
  const projects = await getProjectsByRole(user);

  return (
    <section className="w-full">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <ProjectListClient projects={projects} user={user} />
      </div>
    </section>
  );
}
