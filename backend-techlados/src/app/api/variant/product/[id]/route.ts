import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Variant } from "@/models/variant";
import { authMiddleware } from "@/middleware/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    try {
        const authResult = await authMiddleware(req, { id: userId });

        if("success" in authResult && authResult?.success){
            const varFound = await Variant.find({ product: id});
            return NextResponse.json({ data: varFound }, { status: 200 });
        }

        return NextResponse.json(authResult);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching variant data" }, { status: 500 });
    }

}