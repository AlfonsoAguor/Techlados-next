import User from "@/models/user";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";
import { connectDB } from "@/libs/mongodb";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    
    try {
        await connectDB();
        const { id } = await params;
        // Al middleware se le pasa req y el id obtenido de params
        const authResult = await authMiddleware(req, { id: id });

        // Si el resultado contiene success continuamos, si no devuelve el error
        if("success" in authResult && authResult?.success){
            const userFound = await User.findById(id).exec();

            if (!userFound) {
            return NextResponse.json({ message: "usuario no encontrado" }, { status: 404 });
            }
    
            return NextResponse.json(userFound);
        } else {
            return authResult;
        }
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching user data" }, { status: 500 });
    }
}
