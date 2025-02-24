import { z } from "zod";

export const propertySchema = z.object({
    name: z.string().min(1, "Introduce nombre a la propiedad"),
    values: z.array(z.string().min(1, "Introduce al menos un valor a la propiedad"))
});
