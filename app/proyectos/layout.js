import Navbar from "@/components/layout/NavBar";
import { getUserWithRole } from "@/helpers/users/server";
import { redirect } from "next/navigation";

export default async function ProyectosLayout({ children }) {
  const user = await getUserWithRole();

  if (!user) redirect("/login");

  return (
    <div>
      <Navbar user={user} />
      <main className="p-4">{children}</main>
    </div>
  );
}
