import { z } from "zod";

export const brandSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    categories: z.array(z.string()).nonempty("Debe haber al menos una categoría"),
});
