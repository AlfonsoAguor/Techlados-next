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
    try {
        await connectDB();
        const body = await req.json();
        const validatedData = categorySchema.parse(body);
        const { name }  = validatedData;

        const prod = new Category({name});
        const prodSaved = await prod.save();

        return NextResponse.json({ message: "Categoria creada", data: prodSaved }, { status: 200 });

    } catch (error: any) {
        console.log(error.errors);
        return NextResponse.json(
            { error: error.errors || "Error al crear la categoría" },
            { status: 400 }
        );
    }
}


export async function PUT(req: Request) {
    await connectDB();
    const body = await req.json();

    try {
        const { id } = body;
        const validatedData = categorySchema.parse(body);
        const { name }  = validatedData;
        
        const prodSaved = await Category.findByIdAndUpdate(id, { name });
        return NextResponse.json({ message: "Categoria creado", data: prodSaved },{ status:200 });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || "Error al crear la categoría" },
            { status: 400 }
        );
    }
 
}
