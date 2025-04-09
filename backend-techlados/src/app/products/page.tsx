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
  const [ changedProd, setChangedProd ] = useState(true);

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

    if(changedProd){
      fetchProducts();
      setChangedProd(false);
    }
  }, [changedProd])

  const handleEditProp = async (id: any) => {
    router.push(`/products/edit/${id}`)
  }

  const handleDeleteProp = async (id: any) =>{
    const result = await Swal.fire({
      title: `¿Quieres eliminar el producto ${productsData.name}?`,
      showDenyButton: true,
      denyButtonText: "No",
      confirmButtonText: "Si, eliminar",
      customClass: {
        confirmButton: "swal-confirm",
        denyButton: "swal-deny",
      },
    });

    if (result.isConfirmed) {
      try {
         await axios.delete(`/api/variant/product/${id}`, {
          headers: {
            "X-User-Id": userId,
          },
        });
        
        await axios.delete(`/api/products/${id}`, {
          headers: {
            "X-User-Id": userId,
          },
        });

        setChangedProd(true);
        Swal.fire({ title: "Producto eliminada correctamente" });
      } catch (error) {
        Swal.fire({ title: "No se pudo eliminar el producto" });
      }
    }
  }

  const handleEditVariantProp = async (id: any) =>{
    router.push(`/products/variant/${id}`)
  }

  return (
    <div className='mt-2'>
      <Link href={'/products/new'} className='btn-info'>Añadir un nuevo producto</Link>
      {productsData.length > 0 ? (
        <div>
          <h2 className="my-4">Listado de productos</h2>
          <Table
            data={productsData}
            columns={[{ key:"name", label:"Nombre" }, {key:"brand.name", label: "Marca"}, {key: "price", label: "Precio"}]}
            onEdit={handleEditProp}
            onDelete={handleDeleteProp}
            onEditVariant={handleEditVariantProp}
          />
        </div>
      ):(
        <div className='my-8 text-xl'>No hay productos</div>
      )}
    </div>
  )
}

export default ProductPage