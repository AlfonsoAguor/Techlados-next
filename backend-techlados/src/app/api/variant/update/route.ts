import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Variant } from "@/models/variant";

//Esta interfaz la utlizaremos en las variantes actuales y antiguas, para poder compararlas sin problemas
interface VariantProperty {
    name: string;
    value: string;
    
}

interface VariantSchema {
    _id: string;
    product: string;
    properties: VariantProperty[];
    stock: number;
    price: number;
}

export async function PUT(req: Request) {
    await connectDB();
    try {
        const body = await req.json();
        const { id, properties } = body;
        
        // Obtenemos las variantes del producto
        const currentVariants: VariantSchema[] = await Variant.find({product: id});

        // Función para obtener todas las combinaciones posibles
        const getCombinations = (options: Record<string, string[]>): { name: string; value: string }[][] => {
            const keys = Object.keys(options);
            const values = Object.values(options);
        
            const cartesian = (vals: string[][]): string[][] =>
                vals.reduce((a: string[][], b: string[]) => 
                    a.flatMap(d => b.map(e => [...(Array.isArray(d) ? d : [d]), e]))
                , [[]]);
        
            const combinations = cartesian(values);
        
            return combinations.map(combination =>
                keys.map((key, i) => ({
                    name: key,
                    value: combination[i]
                }))
            );
        };        
        const newsVariants: VariantProperty[][] = getCombinations(properties); 

        //Aqui ordenamos alfabeticamente las propiedades que le pasaremos, para que sea mas facil compararlo posteriormente
        const sortProperties = ( properties: VariantProperty[]) => {
            return [...properties].sort((a, b) => a.name.localeCompare(b.name));
        };

        // Funcion para obtener las variantes para crear
        const variantsToCreate = newsVariants.filter(newVariant => {
            const sortedNewVariant = sortProperties(newVariant);
        
            const exists = currentVariants.find(variant => {
                const sortedOldVariant = sortProperties(
                    variant.properties.map(({ name, value }) => ({ name, value }))
                );
                return JSON.stringify(sortedOldVariant) === JSON.stringify(sortedNewVariant);
            });
        
            return !exists
        });

        // Funcion para obtener las variantes a eliminar
        const variantsToDelete = currentVariants.filter(currentVariant => {
            const sortedOldVariant = sortProperties(
                currentVariant.properties.map(({ name, value }) => ({ name, value }))
            );
        
            const exists = newsVariants.find(newVariant => {
                const sortedNewVariant = sortProperties(newVariant);
                return JSON.stringify(sortedOldVariant) === JSON.stringify(sortedNewVariant);
            });

            return !exists
        })
        
        if(variantsToDelete){
            const varToDel = variantsToDelete.map(variant => variant._id)
            await Variant.deleteMany({_id: { $in: varToDel}})
        }

        if(variantsToCreate){
            await Variant.insertMany(
                variantsToCreate.map(variantProps => ({
                    product: id,
                    properties: variantProps,
                    stock: 0,
                    price: 0
                }))
            )
        }

        return NextResponse.json({ message: "Variantes creadas"});

    } catch (error: any) {
        console.error("Error al crear variantes:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
