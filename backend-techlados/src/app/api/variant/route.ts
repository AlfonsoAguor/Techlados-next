import { Variant } from "@/models/Variant";
import { Product } from "@/models/Product";
import dbConnect from "@/utils/dbConnect";

export default async function handler(req, res) {
    await dbConnect();  // Conectar a la base de datos

    if (req.method === "POST") {
        try {
            const { product, properties, price, stock } = req.body;

            // Verificar si el producto existe
            const existingProduct = await Product.findById(product);
            if (!existingProduct) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            // Generar combinaciones de propiedades
            const propertyKeys = Object.keys(properties); // ["Color", "Almacenamiento"]
            const propertyValues = Object.values(properties); // [["Rojo", "Azul"], ["64GB", "128GB"]]

            function generateCombinations(arr, index = 0, current = []) {
                if (index === arr.length) return [current];
                return arr[index].flatMap(value =>
                    generateCombinations(arr, index + 1, [...current, value])
                );
            }

            const combinations = generateCombinations(propertyValues);

            // Crear variantes con cada combinación
            const variantDocs = combinations.map(combination => {
                const variantProperties = propertyKeys.map((key, i) => ({
                    name: key,
                    value: combination[i]
                }));

                return new Variant({
                    product,
                    properties: variantProperties,
                    price,
                    stock
                });
            });

            // Guardar en la base de datos
            await Variant.insertMany(variantDocs);

            res.status(201).json({ message: "Variantes creadas", variants: variantDocs });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error creando variantes" });
        }
    } else {
        res.status(405).json({ error: "Método no permitido" });
    }
}
