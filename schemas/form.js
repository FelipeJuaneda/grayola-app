import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  assigned_to: z.array(z.string()).optional(),
});
