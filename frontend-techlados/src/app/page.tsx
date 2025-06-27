"use client"

import { Center } from "@/components/Center"
import { useProduct } from "@/context/ProductContext";
import Featured from "@/components/Featured";
import NewProducts from "@/components/NewProducts";

export default function Home() {

  const { productData, iphoneData } = useProduct();


return (
    <div>
      <Featured/>
      <NewProducts />
    </div>
  );
}
