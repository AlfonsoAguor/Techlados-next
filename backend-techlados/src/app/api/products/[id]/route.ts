import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Product } from "@/models/product";
import { authMiddleware } from "@/middleware/auth";


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    try {
        const authResult = await authMiddleware(req, { id: userId });

        if("success" in authResult && authResult?.success){
            console.log("Pasamos el auth");
            await Product.findByIdAndDelete(id);
            return NextResponse.json({ message: "Producto eliminado" }, { status: 200 });
        }

        return NextResponse.json(authResult);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching product data" }, { status: 500 });
    }
    
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    try {
        const authResult = await authMiddleware(req, { id: userId });

        if("success" in authResult && authResult?.success){
            const prodFound = await Product.findById(id);
            return NextResponse.json({ data: prodFound }, { status: 200 });
        }

        return NextResponse.json(authResult);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching product data" }, { status: 500 });
    }

}