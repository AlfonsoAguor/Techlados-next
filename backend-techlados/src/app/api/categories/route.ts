import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { categorySchema } from "@/schema/categorySchema";
import { Category } from "@/models/category";

export async function GET(req: Request) {
    await connectDB();
    
    try {
        const catFounds = await Category.find();

        return NextResponse.json({data: catFounds});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 400 })
    }
}

export async function POST(req: Request) {
    await connectDB();
    const body = await req.json();

    try {
        const validatedData = categorySchema.parse(body);
        const { name }  = validatedData;
        
        const prod = new Category({name});
        const prodSaved = await prod.save();

        return NextResponse.json({ message: "Categoria creado", data: prodSaved },{ status:200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
    }
 
}

