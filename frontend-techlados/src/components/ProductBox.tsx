import React, { useEffect } from "react";
import { CartIcon } from "./Icons/CartIcon";
import { useProduct } from "@/context/ProductContext";

interface ProductBoxProps {
  numberProducts: number;
}

export default function ProductBox({numberProducts}: ProductBoxProps) {

  const { productData } = useProduct();
  console.log("Cantidad de productos a mostrar", productData)

  return (
    <div className="rounded-lg">
      <a
        href="/product/[id]"
        className="bg-white p-5 h-32 text-center flex items-center justify-center rounded-lg shadow-[2px_2px_5px_2px_rgba(0,0,0,0.2)]"
      >
        <img src="/ruta/de/la/imagen.jpg" alt="Producto" className="max-w-full max-h-full" />
      </a>

      <div className="mt-1 gap-10">
        <a href="/product/[id]" className="text-sm no-underline">
          Nombre del producto
        </a>

        <div className="block md:flex md:items-center">
          <div className="md:text-2xl font-medium md:text-left">
            99€
          </div>
          <div className="mt-2 md:mt-0 md:ml-[10px]">
            <button className="w-full flex gap-2 md:w-auto btn-white border border-gray-300">
              Añadir <CartIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
