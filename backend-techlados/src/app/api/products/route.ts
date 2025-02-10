import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { productSchema } from "@/schema/productSchema";

export async function POST(req: Request) {
    await connectDB();
    const body = await req.json();

    try {
        const validatedData = productSchema.parse(body);
        return NextResponse.json({ message: "Producto creado", data: validatedData });

    } catch (error: any) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
    }

}