import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Property } from "@/models/property";
import { propertySchema } from "@/schema/propertySchema";
import { authMiddleware } from "@/middleware/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = propertySchema.parse(body);
        const { name, values } = validatedData;

        const userId = req.headers.get("x-user-id");
        const authResult = await authMiddleware(req, { id: userId });

        const prop = new Property({name, values});
        const propSaved = await prop.save();

        return NextResponse.json({ message: "Creado correctamente"}, { status: 201 });
    } catch (error: any) {
        console.log(error.errors);
        return NextResponse.json(
            { error: error.errors || "Error al crear la categoría" },
            { status: 400 }
        );
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const propFounds = await Property.find();

        return NextResponse.json({data: propFounds});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 400 })
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { id } = body;
        const validatedData = propertySchema.parse(body);
        const { name, values } = validatedData;

        const userId = req.headers.get("x-user-id");
        const authResult = await authMiddleware(req, { id: userId });

        const propUpdated = await Property.findByIdAndUpdate(id, {name, values});

        return NextResponse.json({message: "ok"}, {status: 200});
        
    } catch (error: any) {
        console.log(error.errors);
        return NextResponse.json(
            { error: error.errors || "Error al crear la categoría" },
            { status: 400 }
        );
    }
}
