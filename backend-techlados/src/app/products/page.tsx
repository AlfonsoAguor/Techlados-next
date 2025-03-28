'use client'

import { useEffect, useState } from 'react'
import axios, {AxiosError} from "axios"
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2"
import Link from 'next/link'
import React from 'react'
import Table from '@/components/Table'

import { useUser } from '@/context/UserContext'
import { Product } from '../../../types/product'
import { Variant } from '../../../types/variant'

function ProductPage() {

  const { userData } = useUser();
  const userId = userData?._id;
  const router = useRouter();

  //const { productsData, setProductsData } = useProduct(); De este modo es para obtener unicamente los datos
  const [ productsData, setProductsData ] = useState<Product[] | any>([]); // De este modo cuando se hace cambios de estado

  const [ newError, setNewError ] = useState<{ path?: string[], message: string }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resProd = await axios.get('/api/products');
        setProductsData(resProd.data.data);

      } catch (error) {
        if (error instanceof AxiosError){
          setNewError(error.response?.data.error || []);
        }
      }
    }

    fetchProducts();
  }, [])

  const handleEditProp = async (id: any) => {
    console.log("Editar: ", id);
  }

  const handleDeleteProp = async (id: any) =>{
    console.log("Eliminar: ", id);
  }

  const handleEditVariantProp = async (id: any) =>{
    router.push(`/products/variant/${id}`)
  }

  return (
    <div className='mt-2'>
      <Link href={'/products/new'} className='btn-info'>Añadir un nuevo producto</Link>
      <div>
        <h2 className="my-4">Listado de productos</h2>
        <Table
          data={productsData}
          columns={[{ key:"name", label:"Nombre" }, {key:"brand.name", label: "Marca"}]}
          onEdit={handleEditProp}
          onDelete={handleDeleteProp}
          onEditVariant={handleEditVariantProp}
        />
      </div>
    </div>
  )
}

export default ProductPage