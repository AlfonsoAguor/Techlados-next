import Layout from '@/components/Layout'
import ProductForm from '@/components/ProductForm';
import axios from 'axios';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function EditProductPage(){
  const [dataProduct, setDataProduct] = useState();
  const router = useRouter();
  const {id} = router.query;

  useEffect(() => {
    if(!id){
      return;
    }

    axios.get('/api/products?id=' + id)
    .then((res) => {
      setDataProduct(res.data);
      })
      .catch((error) => {
        console.error('Error al obtener el producto:', error.response?.data || error.message);
    });

  }, [id])
    
  return (
    <Layout>
      <h1>Editar Producto</h1>
      {dataProduct && (
        <ProductForm {...dataProduct}/>
      )}
    </Layout>
  )
}
