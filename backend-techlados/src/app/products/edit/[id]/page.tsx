"use client"
import { useParams } from "next/navigation"

import ProductForm from "@/components/ProductForm";

function EditProductPage() {
  const params = useParams()
  const productId = Array.isArray(params.id) ? params.id[0] : params.id
  
  return (
    <>
      <h1 className='titulo'>Editar producto</h1>
      <div className="border-decoration"></div>
      <ProductForm productId={productId}/>
    </>
  )
}

export default EditProductPage