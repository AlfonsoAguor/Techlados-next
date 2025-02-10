import ProductForm from '@/components/ProductForm'
import React from 'react'

function NewProductPage() {
  return (
    <div>
        <h1 className='titulo'>Crear un nuevo producto</h1>
        <div className="border-decoration"></div>
        <ProductForm />
    </div>
  )
}

export default NewProductPage