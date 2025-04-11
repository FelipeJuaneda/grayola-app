"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/schemas/auth";
import { loginUser, registerUser } from "@/helpers/auth/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoading } from "@/context/Loading/LoadingContext";
import ParticlesBackground from "../particles/ParticlesBackground";
import { useTheme } from "next-themes";

export default function AuthForm({ type = "login" }) {
  const router = useRouter();
  const isLogin = type === "login";
  const { setIsLoading, isLoading } = useLoading();
  const { resolvedTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const { error } = isLogin
        ? await loginUser(values.email, values.password)
        : await registerUser(values.email, values.password);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (isLogin) {
        router.push("/proyectos");
      } else {
        toast.success("Cuenta creada. Ahora iniciá sesión.");
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden min-h-screen md:block">
        <ParticlesBackground />
        {resolvedTheme && (
          <div
            className={`absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-r from-transparent ${
              resolvedTheme === "dark" ? "to-neutral-950" : "to-white"
            }`}
          />
        )}
      </div>

      <div className="flex items-center justify-center px-4 py-12 bg-white dark:bg-neutral-950">
        <Card className="w-full max-w-md border border-gray-200 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </CardTitle>
            <p className="text-sm text-center text-muted-foreground">
              {isLogin
                ? "Ingresá tus datos para continuar"
                : "Registrate para empezar a usar Grayola"}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@grayola.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading
                  ? "Cargando..."
                  : isLogin
                  ? "Ingresar"
                  : "Registrarse"}
              </Button>
            </form>

            <div className="mt-4 text-sm text-center text-muted-foreground">
              {isLogin ? (
                <>
                  ¿No tenés cuenta?{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 mt-2 text-sm font-medium cursor-pointer"
                    onClick={() => router.push("/register")}
                  >
                    Registrate
                  </Button>
                </>
              ) : (
                <>
                  ¿Ya tenés una cuenta?{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 mt-2 text-sm font-medium cursor-pointer"
                    onClick={() => router.push("/login")}
                  >
                    Iniciar sesión
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
