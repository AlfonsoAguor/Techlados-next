import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "El nombre debe de contener min un caracteres"),
    description: z.string().optional(),
    specifics: z.string().min(1, "Introduce las especificaciones"),
    brand: z.string().min(1, "Introduce una marca"),
    category: z.string().min(1, "Introduce la categoria"),
    properties: z.record(z.array(z.string())).refine(
        (obj) => Object.keys(obj).length > 0, 
        { message: "Debe haber al menos una propiedad" }
    ),
    images: z.array(z.string()).nonempty("Introduce al menos una imagen"),

});