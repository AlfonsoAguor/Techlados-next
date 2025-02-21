import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import { Specific } from "@/models/specific";

export async function POST(req: Request) {
    try {
        const body = await req.json(); // 📌 Extrae el body correctamente
        const { catID, properties } = body; // 📌 Desestructura los datos

        console.log("catID recibido:", catID);
        console.log("Properties recibidas:", properties);

        // Aquí puedes hacer lo que necesites con los datos, como guardarlos en la base de datos

        return NextResponse.json({ message: "Datos recibidos correctamente", catID, properties }, { status: 200 });
    } catch (error) {
        console.error("Error en el API:", error);
        return NextResponse.json({ message: "Error en el servidor", error }, { status: 500 });
    }
}
