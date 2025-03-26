import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Variant } from "@/models/variant";

export async function POST(req: Request) {
    await connectDB();
    try {
        const body = await req.json();
        const { id, properties } = body;

        // Función para obtener todas las combinaciones posibles
        /*
            Le indicamos que el getCombinantion se le pasara Objeto que contendra un string y un string de arrays, estos seran name y value.
            Al indicarle [][], le estamos diciendo que sera un array de arrays, para que quede de la siguiente manera
            [
                [{name: Color, value: Azul}, {name: Almacenamiento, value: 8GB}],
                [{name: Color, value: Rojo}, {name: Almacenamiento, value: 16GB}],
            ]
        */
        const getCombinations = (options: Record<string, string[]>): { name: string; value: string }[][] => {
            /* Guardamos en arrays los nombres de las propiedades (claves) y los valores */
            const keys = Object.keys(options);
            const values = Object.values(options);
        
            /*
                Creamos una funcion cartesiana, para devolver todas las combinaciones posibles. 
                Le indicamos que los valores seran un array de arrays y que devolvera un array de arrays
                Con reduce combina de todos los elementos de los arrays
                    - Coge el primer conjunto y almacena en b = ["Negro", "Blanco"], d = [] generando [["Negro"], ["Blanco"]]
                    - Coge el segundo conjunto y almacena en b = ["4GB", "8GB"], d = ["Negro"], d = ["Blanco"] generando [["Negro", "4"], ["Negro", "8"], ["Blanco", "4"], ["Blanco", "8"]]
                
                a => Almacena las combinaciones generadas hasta el momento.
                b => Almacena los conjuntos, por ejemplo en el primer paso seria ["Negro", "Blanco"]
                d => Almacena las combinaciones generadas hasta el momento, por ejemplo el primer paso seria [], segundo d = ["Negro"], d = ["Blanco"], en el tercero d = ["Negro", "4"], d = ["Negro", "8"], d = ["Blanco", "4"], d = ["Blanco", "8"]
                e => Es un valor del conjunto actual que estamos agregando a cada combinación ejemplo "Negro", "Blanco"  
            */
            const cartesian = (vals: string[][]): string[][] =>
                vals.reduce((a: string[][], b: string[]) => 
                    a.flatMap(d => b.map(e => [...(Array.isArray(d) ? d : [d]), e]))
                , [[]]);
        

            /* 
                LLamammos a la funcion cartesiana y le pasamos los values, que seria como lo siguiente
                [["Negro", "Blanco"], ["4GB", "8GB"], ["64GB", "128GB"]]

            */
            const combinations = cartesian(values);
        
            /*
                Hace un map de lo anterior y luego un map de las keys
            */
            return combinations.map(combination =>
                keys.map((key, i) => ({
                    name: key,
                    value: combination[i]
                }))
            );
        };        

        // Generar todas las combinaciones de variantes
        const variantCombinations = getCombinations(properties);

        // Crear las variantes en la base de datos
        const createdVariants = await Variant.insertMany(
            variantCombinations.map(variantProps => ({
                product: id,
                properties: variantProps,
                stock: 0,
                price: 0
            }))
        );

        return NextResponse.json({ message: "Variantes creadas", variants: createdVariants });

    } catch (error: any) {
        console.error("Error al crear variantes:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
