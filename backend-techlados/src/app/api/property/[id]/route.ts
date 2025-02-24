import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Property } from "@/models/property";
import { authMiddleware } from "@/middleware/auth";


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    try {
        const authResult = await authMiddleware(req, { id: userId });

        if("success" in authResult && authResult?.success){
            await Property.findByIdAndDelete(id);
            return NextResponse.json({ message: "Propiedad eliminada" }, { status: 200 });
        }

        return NextResponse.json(authResult);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching property data" }, { status: 500 });
    }
    
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    try {
        const authResult = await authMiddleware(req, { id: userId });

        if("success" in authResult && authResult?.success){
            const propFound = await Property.findById(id);
            return NextResponse.json({ data: propFound }, { status: 200 });
            
        }

        return NextResponse.json(authResult);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching propeties data" }, { status: 500 });
    }

}