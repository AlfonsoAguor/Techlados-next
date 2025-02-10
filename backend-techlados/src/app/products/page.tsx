import Link from 'next/link'
import React from 'react'

function ProductPage() {
  return (
    <div className='mt-2'>
      <Link href={'/products/new'} className='btn-info'>Añadir un nuevo producto</Link>
    </div>
  )
}

export default ProductPage