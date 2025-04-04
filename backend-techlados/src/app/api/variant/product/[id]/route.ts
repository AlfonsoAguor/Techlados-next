import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Variant } from "@/models/variant";
import { Product } from "@/models/product";
import { authMiddleware } from "@/middleware/auth";
import { variantSchema } from "@/schema/variantSchema";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const userId = req.headers.get("x-user-id");
        const authResult = await authMiddleware(req, { id: userId });

        if("success" in authResult && authResult?.success){
            const varFound = await Variant.find({ product: id});
            return NextResponse.json({ data: varFound }, { status: 200 });
        }

        return NextResponse.json(authResult);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error con la obtencion de datos de las variantes" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: {id: string}}) {
    await connectDB();
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    try {
        const authResult = await authMiddleware(req, { id: userId });

        if("success" in authResult && authResult?.success){
            const varDeleted = await Variant.deleteMany({ product: id});
            return NextResponse.json({ status: 200 });
        }

        return NextResponse.json(authResult);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error al eliminar las variantes" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: {id: string}}) {
    try {
        await connectDB;
        const { id } = await params;
        const userId = req.headers.get("x-user-id");
        const body = await req.json();
        const validateVariantData = variantSchema.parse(body);
        const { price, stock } = validateVariantData;
        const authResult = await authMiddleware(req, {id: userId});

        if("success" in authResult && authResult?.success){
            await Variant.findByIdAndUpdate(id, { price, stock });
            return NextResponse.json({status: 200});
        }

        return NextResponse.json(authResult);
    } catch (error: any) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
    }
}