import { z } from "zod";

export const variantSchema = z.object({
    stock: z.number().nonnegative("El stock no puede ser negativo"),
    price: z.number().nonnegative("El precio no puede ser negativo"),
});