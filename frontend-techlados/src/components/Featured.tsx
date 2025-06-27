import React from 'react'
import { useProduct } from "@/context/ProductContext";
import { Center } from './Center';

export default function Featured() {

  const { iphoneData } = useProduct();

  return (
    <div className=' bg-[#222]'>
      <Center>
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 py-10">
          {/* Texto */}
          <div className="flex items-center order-2 px-5 md:order-none">
            <div>
              <h1 className="text-white m-0 font-normal text-xl md:text-5xl">{iphoneData?.name}</h1>
              <p className="text-gray-400 text-sm mt-2">{iphoneData?.description}</p>
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
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${iphoneData?.images[0]}`}
              alt="Lorem"
              className="max-w-full max-h-[200px] md:max-h-none block mx-auto"
            />
          </div>
        </div>
      </Center>
    </div>
  )
}
