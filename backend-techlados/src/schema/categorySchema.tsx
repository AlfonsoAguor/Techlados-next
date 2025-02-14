import { z } from "zod";

export const categorySchema = z.object({
    name: z.string().min(2, "La categoria debe de contener min 2 caracteres"),
});