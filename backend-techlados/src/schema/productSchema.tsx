import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "El nombre debe de contener min un caracteres"),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, "El precio debe ser un número válido"),
    stock: z.string().regex(/^\d+$/, "El stock debe ser un número entero"),
    description: z.string().optional(),
});