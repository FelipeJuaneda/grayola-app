"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/helpers/auth/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await logoutUser();
      if (error) {
        toast.error("❌ Error al cerrar sesión:", error.message);
        return;
      }
      toast.success("✅ Sesión cerrada con éxito.");
      router.push("/login");
    } catch (err) {
      toast.error("❌ Error inesperado l cerrar sesión:");
    }
  };

  return (
    <header className="border-b px-6 py-4 flex items-center justify-between bg-white">
      <h1 className="text-lg font-semibold">Grayola</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.full_name?.[0] || user?.email?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {user?.full_name || user?.email}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-3 py-1">
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <p className="text-xs">
              Rol: <strong>{user?.role}</strong>
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
