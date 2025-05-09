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
import { useLoading } from "@/context/Loading/LoadingContext";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Navbar({ user }) {
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await logoutUser();
      if (error) {
        toast.error("Error al cerrar sesión:", error.message);
        return;
      }
      toast.success("Sesión cerrada con éxito.");
      router.push("/login");
    } catch (err) {
      toast.error("Error inesperado al cerrar sesión:");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background">
      <h1 className="text-lg font-semibold">Grayola</h1>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
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
      </div>
    </header>
  );
}
