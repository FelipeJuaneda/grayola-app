import { redirect } from "next/navigation";
import { getSession } from "@/helpers/auth/server";

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect("/proyectos");
  } else {
    redirect("/login");
  }
}
