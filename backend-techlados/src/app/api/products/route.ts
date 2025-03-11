import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { productSchema } from "@/schema/productSchema";
import { Product } from "@/models/product";

export async function POST(req: Request) {
    await connectDB();
    const body = await req.json();

    try {
        const validatedData = productSchema.parse(body);
        const {name, description, specifics, images, brand, category, properties} = validatedData;
        
        const prod = new Product({name, description, specifics, images, brand, category, properties});
        const prodSaved = await prod.save();

        return NextResponse.json({ message: "Producto creado", data: prodSaved });

    } catch (error: any) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
    }
 
}