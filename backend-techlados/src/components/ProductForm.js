import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  _id,
  images: existingImages,
  brand: existingBrand,
  category: existingCategory,
  subCategory: existingSubCategory,
  properties: assignedProperties
}) {
  const router = useRouter();

  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(existingCategory || "");
  const [subCategory, setSubCategory] = useState(existingSubCategory || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [selectedBrand, setSelectedBrand] = useState(existingBrand || "");
  const [images, setImages] = useState(existingImages || []);
  const [productProperties, setProductProperties] = useState(assignedProperties || {});

  const [goToProduct, setGoToProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
    axios.get('/api/brand').then(result => {
      setBrands(result.data);
    });

  },[]);

  async function uploadImage(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.filePaths];
      });
    }
  }

  async function createProduct(e) {
    e.preventDefault();

    try {
      const data = { title, description, price, images, brands, category, subCategory, properties: productProperties };
      // data.category = category && category !== "" ? category : null;

      if (_id) {
        //Actualizar Producto
        const response = await axios.put("/api/products", { ...data, _id });
      } else {
        // Crear Producto
        const response = await axios.post("/api/products", data);
      }
      setGoToProduct(true);
    } catch (error) {
      console.error(
        "Error al crear el producto:",
        error.response?.data || error.message
      );
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  if (goToProduct) {
    router.push("/products");
  }

  return (
    <form onSubmit={createProduct}>
      <label>Nombre del producto</label>
      <input
        type="text"
        placeholder="Nombre" 
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      ></input>

      <label>Categoria padre:</label>
      <div className="flex flex-row gap-4 items-start mr-4">
        {categories?.map((cate) =>
          cate.parent === null && (
            <div key={cate._id} className="flex items-center">
              <input
                type="radio"
                value={cate._id}
                checked={category === cate._id} 
                onChange={() => setCategory(cate._id)}
                id={`category-${cate._id}`}
                className="mt-2 mr-2"
              />
              <label className="text-black">{cate.name}</label>
            </div>
          )
        )}
      </div>

      {category.length > 0 && (
        <div className="my-3">
          <label>Subcategoria</label>
          <div className="flex flex-row gap-4 items-start">
          {categories
            .filter(c => c.parent?._id === category)
            .map(sub => (
              <div key={sub._id}  className="flex items-center">
                <input 
                  type="radio" 
                  className=" mt-2 mr-2" 
                  value={sub._id}
                  checked={subCategory === sub._id}
                  onChange={() => setSubCategory(sub._id)}/>
                <label className="text-black">{sub.name}</label>
              </div>
            ))}
            </div>
        </div>
      )}

      <div className="mb-2">
        <label>Imagenes</label>
        <div>
        <ReactSortable list={images} setList={updateImagesOrder}>
          {!!images?.length &&
            images.map((filePath) => (
              <div key={filePath} className="inline-block h-24 mt-4 mx-2">
                <img src={`${filePath}`} className="rounded-lg drop-shadow-lg"/>
              </div>
            ))}
        </ReactSortable>
        </div>
        <label
          htmlFor="file-upload"
          className="cursor-pointer w-36 h-10 my-2 border text-center flex items-center justify-center text-slate-800 bg-slate-300 rounded-md"
        >
          Subir
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
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

      <label>Descripción</label>
      <textarea
        placeholder="Descripcion"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>

      <label>Precio</label>
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      ></input>

      <label>Marca</label>
      <select onChange={e => setSelectedBrand(e.target.value)}>
        {brands?.map((brand) => (
          <option value={brand._id} key={brand._id}>{brand.name}</option>
        ))}
      </select>
      {/*<input
        type="text"
        placeholder="Marca"
        value={brand}
        onChange={(ev) => setBrand(ev.target.value)}
      ></input>*/}

      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
}
