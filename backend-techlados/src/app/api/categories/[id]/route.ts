import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Category } from "@/models/category";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "ID Requerido" }, { status: 400 });
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ message: "Categoria eliminada" }, { status: 200 });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = await params;


}