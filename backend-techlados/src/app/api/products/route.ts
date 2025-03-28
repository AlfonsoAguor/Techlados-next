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

        return NextResponse.json({ message: "Producto creado", data: prodSaved});

    } catch (error: any) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
    }
 
}

export async function GET(req: Request) {
    await connectDB();

    try {
        const productFound = await Product.find().populate('brand');
        return NextResponse.json({data: productFound});

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 400 })
    }
}