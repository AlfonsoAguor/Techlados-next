import React from 'react'
import { Center } from './Center';
import ProductBox from './ProductBox';

export default function NewProducts() {

    

  return (
    <Center>
        <h1 className='text-3xl font-bold my-10'>Nuevos productos</h1>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-[30px] pt-[10px]'>
            <ProductBox numberProducts={8} />
        </div>
    </Center>
  )
}
