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
import Image from "next/image";

export default function AuthForm({ type = "login" }) {
  const router = useRouter();
  const isLogin = type === "login";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (values) => {
    try {
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
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block relative min-h-screen bg-gray-100 overflow-hidden">
        <Image
          src="/ilustracionAuth.png"
          alt="Diseño colaborativo"
          fill
          priority
          draggable={false}
          className="object-cover object-top-left select-none"
          sizes="(min-width: 768px) 50vw, 100vw"
        />

        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-white z-10" />
      </div>

      <div className="flex items-center justify-center px-4 py-12 bg-white">
        <Card className="w-full max-w-md shadow-xl border border-gray-200">
          <CardHeader className="space-y-2">
            <CardTitle className="text-center text-2xl font-bold tracking-tight">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
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
                  <p className="text-sm text-red-600 mt-1">
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
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? "Cargando..."
                  : isLogin
                  ? "Ingresar"
                  : "Registrarse"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {isLogin ? (
                <>
                  ¿No tenés cuenta?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm font-medium mt-2"
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
                    className="p-0 h-auto text-sm font-medium mt-2 cursor-pointer"
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
