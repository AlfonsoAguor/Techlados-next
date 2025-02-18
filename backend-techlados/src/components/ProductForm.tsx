'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';
import { ReactSortable } from 'react-sortablejs';

export default function ProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [newError, setNewError] = useState<{ path?: string[], message: string }[]>([]);

  const [ categories, setCategories ] = useState<any[]>([]);
  const [ brands, setBrands ] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        if(brands.length === 0 && categories.length === 0){
          const resCat = await axios.get('/api/categories');
          setCategories(resCat.data.data);
          const resBrand = await axios.get('/api/brands');
          setBrands(resBrand.data.data);
        }

      } catch (error) {
        if (error instanceof AxiosError) {
                    setNewError(error.response?.data.error || []);
                }
      }
    }

    fetchData();
    
  }, []);

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
  }

  const uploadImage = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files || [];
    if(files?.length > 0){
      const data = new FormData();
      for (const file of files){
        data.append("file", file)
      }
      
      const res = await axios.post("/api/upload", data);
      const imageFile = Array.isArray(res.data.files) ? res.data.files : [res.data.files];
      setImages((oldImages) => [...oldImages, ...imageFile]);
    }
  }

  const updateImagesOrder = async(images:any) => {
    setImages(images);
  }

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

      {/* Imagenes */}
      <div className="mb-2">
        <label>Imagenes</label>
        <div>
        <ReactSortable list={images} setList={updateImagesOrder}>
          {!!images?.length &&
            images.map((filePath) => (
              <div key={filePath} className="inline-block h-24 mt-4 mx-2">
                <img src={`/uploads/${filePath}`} className="rounded-lg drop-shadow-lg h-24"/>
              </div>
            ))}
        </ReactSortable>
        </div>
        <label htmlFor="file-upload" className="cursor-pointer w-36 h-10 my-2 border text-center flex items-center justify-center bg-slate-300 rounded-md">
          Subir
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
          </svg>
        </label>

        <input
          id="file-upload"
          type="file"
          onChange={uploadImage}
          className="hidden"
        />

        {!images?.length && <div>Este producto no tiene fotos</div>}
      </div>

      

      <button type="submit" className="btn-info w-25">
        Guardar
      </button>
    </form>
  );
}
