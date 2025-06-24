"use client"

import { Center } from "@/components/Center"
import Link from "next/link";
import { useProduct } from "@/context/ProductContext";

export default function Home() {

  const { productData, iphoneData } = useProduct();
  console.log("Datos del producto", productData, iphoneData);


return (
    <div className="bg-[#222]">
      <Center>
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 py-10">
          {/* Texto */}
          <div className="flex items-center order-2 px-5 md:order-none">
            <div>
              <h1 className="text-white m-0 font-normal text-xl md:text-5xl">Titulo</h1>
              <p className="text-gray-400 text-sm mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea quae distinctio accusamus quaerat minima velit doloremque accusantium repellendus? Dolores nihil, eveniet recusandae qui necessitatibus accusantium quaerat adipisci beatae? Excepturi, maxime!</p>
              <div className="flex gap-2 mt-5">
                <button className="btn-white-outline">
                  Leer más
                </button>
                <button className="btn-white">
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className="flex items-center justify-center">
            <img
              src={`${process.env.NEXT_PUBLIC_BACK_URL}/uploads/1733837982523-iphone-13.png`}
              alt="Lorem"
              className="max-w-full max-h-[200px] md:max-h-none block mx-auto"
            />
          </div>
        </div>
      </Center>
    </div>
  );
}
