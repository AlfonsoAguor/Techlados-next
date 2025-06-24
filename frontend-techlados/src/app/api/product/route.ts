// app/api/product/route.ts
import { getProductModel } from "@/models/product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const Product = await getProductModel();
    const products = await Product.find();

    if (!products || products.length === 0) {
      return NextResponse.json({ message: "No se han encontrado productos" }, { status: 404 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error en el API de productos:", error);
    return NextResponse.json({ message: "Error fetching product data" }, { status: 500 });
  }
}
