import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Product } from "@/models/product";
import { authMiddleware } from "@/middleware/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const userId = req.headers.get("x-user-id");
        const body = await req.json();
        const { updatedVariants } = body;
        const authResult = await authMiddleware(req, {id: userId});

        /* Funcion para almacenar el menor precio y actualizarlo*/
        if("success" in authResult && authResult?.success && updatedVariants){
            let minPrice = Infinity;

            Object.keys(updatedVariants).map(async(id) => {
                const { price } = updatedVariants[id]; 
                if(minPrice > price){
                    minPrice = price;
                }
            })

            await Product.findByIdAndUpdate(id, {price: minPrice});
    
            return NextResponse.json({status: 200});
        }

        return NextResponse.json(authResult);
    } catch (error) {
        return NextResponse.json({ message: "Error update product price data" }, { status: 500 });
    }
}