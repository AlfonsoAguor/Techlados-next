'use client'

import React, { FormEvent, useState } from 'react'
import axios, { AxiosError } from 'axios';

export default function ProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [newError, setNewError] = useState<{ path?: string[], message: string }[]>([]);

  const createProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await axios.post('/api/products', {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
      });
      console.log(res);
      setNewError([]); 
    } catch (error) {
      if (error instanceof AxiosError) {
        setNewError(error.response?.data.error || []);
      }
    }
  };

  return (
    <form className='mt-5 w-full' onSubmit={createProduct}>
      <div className='flex w-full gap-5'>
        <div className='w-1/3'>
          <label>Nombre</label>
          <input type="text" name='name' className="input-default" value={name} onChange={e => setName(e.target.value)} />
          {newError.find(err => err.path?.[0] === "name") && (
            <p className="text-red-500">{newError.find(err => err.path?.[0] === "name")?.message}</p>
          )}
        </div>

        <div className='w-1/5'>
          <label>Precio</label>
          <input type="number" name='price' className="input-default" value={price} onChange={e => setPrice(e.target.value)} />
          {newError.find(err => err.path?.[0] === "price") && (
            <p className="text-red-500">{newError.find(err => err.path?.[0] === "price")?.message}</p>
          )}
        </div>

        <div className='w-1/5'>
          <label>Stock</label>
          <input type="number" name='stock' className="input-default" value={stock} onChange={e => setStock(e.target.value)} />
          {newError.find(err => err.path?.[0] === "stock") && (
            <p className="text-red-500">{newError.find(err => err.path?.[0] === "stock")?.message}</p>
          )}
        </div>
      </div>

      <div className='w-2/4'>
        <label>Descripcion</label>
        <textarea name='description' className="input-default" value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <button type="submit" className="btn-info w-25">
        Guardar
      </button>
    </form>
  );
}
