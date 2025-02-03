import Layout from '@/components/Layout'
import BrandForm from '@/components/BrandForm';
import axios from 'axios';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function EditBrandPage(){
  const [dataBrand, setDataBrand] = useState();
  const router = useRouter();
  const {id} = router.query;

  useEffect(() => {
    if(!id){
      return;
    }

    axios.get('/api/brand?id=' + id)
    .then((res) => {
        setDataBrand(res.data);
      })
      .catch((error) => {
        console.error('Error al obtener el producto:', error.response?.data || error.message);
    });

  }, [id])
    
  return (
    <Layout>
      <h1>Editar Marca</h1>
      {dataBrand && (
        <BrandForm {...dataBrand}/>
      )}
    </Layout>
  )
}
