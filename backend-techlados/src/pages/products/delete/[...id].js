import Layout from '@/components/Layout'
import axios from 'axios';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function DeleteProductPage(){
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

  }, [id]);

  function goBack(){
    router.replace('/products');

  }

  async function deleteProduct() {
    try {
      await axios.delete('/api/products?id=' + id);
      goBack();
    } catch (error) {
      console.error('Error al eliminar el producto:', error.response?.data || error.message);
    }
  }
     
  return (
    <Layout>
      <h1>¿Estas seguro de querer eliminar "{dataProduct?.title}" ?</h1>
      <div className='flex gap-4'>
        <button className="btn-danger" onClick={deleteProduct}>Si</button>
        <button className="btn-primary" onClick={goBack}>No</button>
      </div>
    </Layout>
  )
}