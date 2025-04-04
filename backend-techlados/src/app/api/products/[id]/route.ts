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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const userId = req.headers.get("x-user-id");
        const body = await req.json();
        const { updatedVariants } = body;
        const authResult = await authMiddleware(req, {id: userId});

        /* Funcion para almacenar el menor precio */
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
        return NextResponse.json({ message: "Error update product data" }, { status: 500 });
    }
}