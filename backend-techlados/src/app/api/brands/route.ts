import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Brand } from "@/models/brand";
import { brandSchema } from "@/schema/brandSchema";

export async function GET(req: Request) {
    await connectDB();
    
    try {
        const catFounds = await Brand.find();

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
        const validatedData = brandSchema.parse(body);
        const { name, categories }  = validatedData;
        
        const brand = new Brand({name, category: categories});
        const brandSaved = await brand.save();

        return NextResponse.json({ message: "Marca creada", data: brandSaved },{ status:200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
    }
 
}

export async function PUT(req: Request) {
    await connectDB();
    const body = await req.json();

    try {
        const { id } = body;
        const validatedData = brandSchema.parse(body);
        const { name, categories }  = validatedData;
        
        const brandSaved = await Brand.findByIdAndUpdate(id, { name, category: categories });
        return NextResponse.json({ message: "Marca creada", data: brandSaved },{ status:200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
    }
 
}
