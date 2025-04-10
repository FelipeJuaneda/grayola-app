import { supabase } from "@/lib/supabase-client";

// Iniciar sesion
export const loginUser = async (email, password) => {
  if (!email || !password) {
    return {
      error: { message: "Correo y contraseña son obligatorios." },
      data: null,
    };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Registrarse
export const registerUser = async (email, password) => {
  if (!email || !password) {
    return {
      error: { message: "Correo y contraseña son obligatorios." },
      data: null,
    };
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

// Cerrar sesion
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
