'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';
import { ReactSortable } from 'react-sortablejs';
import { useUser } from '@/context/UserContext';
import { useProduct } from '@/context/ProductContext';
import { useRouter } from 'next/navigation';

export default function ProductForm() {
  const { userData } = useUser();
  const userId = userData?._id;
  const router = useRouter();

  const { productData, setProductData } = useProduct();

  const [ product, setProduct ] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [specifics, setSpecifics] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [newError, setNewError] = useState<{ path?: string[], message: string }[]>([]);
  const [ showMessage, setShowMessage ] = useState(false);

  const [ categories, setCategories ] = useState<any[]>([]);
  const [ brands, setBrands ] = useState<any[]>([]);
  const [ catInBrand, setCatInBrand ] = useState<any[]>([]); // Almacenamos las categorias encontradas en la marca seleccionada
  const [ selectBrand, setSelectBrand ] = useState(""); // Marca seleccionada
  const [ properties, setProperties ] = useState<any[]>([]);
  const [ propInCat, setPropInCat ] = useState<any[]>([]); // Almacenamos las propiedades de la categoria seleccionada
  const [ selectedCat, setSelectedCat ] = useState(""); // Categoria Seleccionada
  const [ selectedVal, setSelectedVal ] = useState<Record<string, string[]>>({});

  /* Fetch categorias y marcas */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(brands.length === 0 && categories.length === 0 && properties.length === 0){
          const resCat = await axios.get('/api/categories');
          setCategories(resCat.data.data);
          const resBrand = await axios.get('/api/brands');
          setBrands(resBrand.data.data);
          const resProp = await axios.get('/api/property');
          setProperties(resProp.data.data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setNewError(error.response?.data.error || []);
        }
      }
    }

    fetchData();
    
  }, []);

  /* Fetch de categoria en la marca seleccionada */
  const fetchBrand = async (id: any) => {
    
    const res = await axios.get(`/api/brands/${id}`, {
      headers: {
          "X-User-Id": userId,
      }
    });
    setSelectBrand(id); // Guardamos la marca seleccionada
    setSelectedCat(""); // Eliminamos la categoria seleccionada
    setSelectedVal({}); // Eliminamos los valores seleccionados
    setPropInCat([]); // Vaciamos las propiedades de la categoria
    setCatInBrand(res.data.data.category);
  }

  /* Fetch de propiedades en la categoria seleccionada */
  const fetchCategory = async (id: any) => {
    const res = await axios.get(`/api/categories/${id}`, {
      headers: {
           "X-User-Id": userId,
      }
    });
    setSelectedVal({});
    setSelectedCat(id);
    setPropInCat([]);
    setPropInCat(res.data.data.properties);
  }

  /* Funcion para seleccionar categorias */
  const handleCheckboxChange = (val: string, name: string) => {
    setSelectedVal((prevSelected) => {
      const currentValues = prevSelected[name] || [];
    
      return {
        ...prevSelected,
        [name]: currentValues.includes(val)
          ? currentValues.filter((value) => value !== val) 
          : [...currentValues, val],
      };
    });
  };

  /* Funcion crear producto */
  const createProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {

      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        specifics: formData.get('specifics'),
        images,
        brand: selectBrand,
        category: selectedCat,
        properties: selectedVal
      }

      const res = await axios.post('/api/products', data);

      if(res.status === 200){
        /*setName(""); setDescription(""); setSpecifics(""); setImages([]);
        setSelectBrand(""); setSelectedCat(""); setSelectedVal({});*/
        let idProd = res.data.data._id;

        const dataVariant = {
          id: idProd,
          properties: selectedVal
        }

        const resVariant = await axios.post('/api/variant/create', dataVariant );

        if(resVariant.status === 200){
          router.push('/products')
        }
      }

      setNewError([]);
       
    } catch (error) {
      setShowMessage(true);
      if (error instanceof AxiosError) {
        console.log("Nuevo error: ", newError);
        setNewError(error.response?.data.error || "Error desconocido");
      }
    }
  }

  /* Funcion de subida de imagenes */
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

  /* Cambio de orden de las imagenes */
  const updateImagesOrder = async(images:any) => {
    setImages(images);
  }

  /* UseEffect de errores */
  useEffect(() => {
    if(showMessage){
      const timer = setTimeout(() => {setShowMessage(false)}, 2000);
      return () => clearTimeout(timer);
    }
  },[newError, showMessage]);

  return (
    <form className='mt-5 w-full' onSubmit={createProduct}>

      {showMessage && newError.map((err) => (
          <div key={err.path?.[0] || err.message} className="fixed left-1/2 transform -translate-x-1/2 top-12 bg-red-500 text-white py-3 px-5 rounded-md">
              {err.message}
          </div>
      ))}

      <div className='flex w-full gap-5'>
        <div className='w-1/3'>
          <label className="label-bold">Nombre</label>
          <input type="text" name='name' className="input-default" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className='w-2/3'>
          <label className="label-bold">Descripcion</label>
          <textarea name='description' className="input-default" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>

      <div className='w-2/4'>
        <label className="label-bold">Especificaciones</label>
        <textarea name='specifics' className="input-default" value={specifics} onChange={e => setSpecifics(e.target.value)} />
      </div>

      {/* Imagenes */}
      <div className="mb-4">
        <label className="label-bold">Imagenes</label>
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

      <div className='flex flex-col w-1/3'>
        <label className="label-bold">Marca</label>
        {brands.length > 0 ? (
          <select onChange={(e => fetchBrand(e.target.value))} className='input-default'>
              <option value={""}>Seleccione marca</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
            ))}
          </select>
        ) : (
          <span>No hay marcas</span>
        )}
        
        {/* Mostrar categorias */}
        {catInBrand && catInBrand.length > 0 &&(
          <div>
            <label className="label-bold">Categorias</label>
            <select onChange={(e => fetchCategory(e.target.value))} className='input-default'>
              <option value={""}>Seleccione categoria</option>
              {catInBrand.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
          </select>
          </div>
        )}

        {/* Mostrar propiedades */}
        {propInCat && propInCat.length > 0 && (
          <div>
            <label className="label-bold">Propiedades</label>
            {propInCat.map((prop) => (
              <div key={prop._id} className=" mb-4 mt-2">
                <label className='underline'>{prop.name}</label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {prop.values.map((val:any, i:number) => (
                    <label key={i} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      value={val} 
                      className="form-checkbox h-5 w-5 text-blue-500"
                      checked={selectedVal[prop.name]?.includes(val) || false}
                      onChange={() => handleCheckboxChange(val, prop.name)}
                    />
                    <span>{val}</span>
                  </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="btn-info w-25">
        Guardar
      </button>
    </form>
  );
}
