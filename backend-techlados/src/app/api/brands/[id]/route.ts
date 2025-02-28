import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Brand } from "@/models/brand";
import { authMiddleware } from "@/middleware/auth";


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    try {
        const authResult = await authMiddleware(req, { id: userId });

        if("success" in authResult && authResult?.success){
            await Brand.findByIdAndDelete(id);
            return NextResponse.json({ message: "Marca eliminada" }, { status: 200 });
        }

        return NextResponse.json(authResult);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching user data" }, { status: 500 });
    }
    
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    try {
        const authResult = await authMiddleware(req, { id: userId });

        if("success" in authResult && authResult?.success){
            const brandFound = await Brand.findById(id).populate('category');
            return NextResponse.json({ data: brandFound }, { status: 200 });
        }

        return NextResponse.json(authResult);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching brand data" }, { status: 500 });
    }

}