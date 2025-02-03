import Layout from '@/components/Layout'
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function Products() { 
  const [productos, setProductos] = useState();

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProductos(response.data);
    });
  }, []);

  return (
    <Layout>
      <Link className="bg-slate-500 text-white py-1 px-2 rounded-md text-sm sm:text-base"  href={'/products/new'}>Nuevo producto</Link>
      <div className='mt-5'>
        <div>
          <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {productos?.map((producto, index) => (
              <div key={index} className='box-producto flex flex-col bg-slate-200 p-5 rounded-md shadow-md'>
                <li><b>Nombre:</b> {producto.title}</li>
                <li><b>Precio:</b> {producto.price}€</li>

                <div className='flex flex-col sm:flex-row justify-around'>
                  <Link href={'/products/edit/' + producto._id} className='btn-warning w-full sm:w-5/12 mt-3'>
                    Editar
                  </Link>

                  <Link href={'/products/delete/' + producto._id} className='btn-danger w-full sm:w-5/12 mt-3'>
                    Eliminar
                  </Link>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

