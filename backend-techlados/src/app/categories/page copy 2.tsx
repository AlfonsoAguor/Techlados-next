"use client";

import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useUser } from "@/context/UserContext";
import Table from "@/components/Table";

interface Property {
  name: string;
  values: string;
}

export default function CategoryPage() {
  const { userData } = useUser();
  const userId = userData?._id;

  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [catChanged, setCatChanged] = useState(true);
  const [category, setCategory] = useState<any | null>(null);

  const [ selectCate, setSelectCate ] = useState<string | ''>('');
  const [ properties, setProperties ] = useState<Property[]>([]); // Editar
  const [ nameProp, setNameProp ] = useState<any[]>([]);
  const [ valueProp, setValueProp ] = useState<any[]>([]);

  const [newError, setNewError] = useState<{ path?: string[], message: string }[]>([]);
  const [ showMessage, setShowMessage ] = useState(false);

  /* Fetch de categorias */
  useEffect(() => {
    const fetchCat = async () => {
      try {
        if (catChanged) {
          const res = await axios.get("/api/categories");
          setCategories(res.data.data);
          setCatChanged(false);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setNewError(error.response?.data.error || []);
        }
      }
    };

    fetchCat();
  }, [catChanged]);

  /* Submit de categorias */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (category && category._id) {

      try {
        const data = { name, id: category._id };
        const res = await axios.put("/api/categories", data);
        setCategory([]);
        setName("");
        setCatChanged(true);
      } catch (error) {

        if (error instanceof AxiosError) {
          setShowMessage(true);
          setNewError(error.response?.data.error || "Error desconocido");
        }
      }

    } else {
      
      try {
        const data = { name };
        const res = await axios.post("/api/categories", data);
        const dataCat = { catID: res.data.data._id, properties};
        const resSpe = await axios.post("/api/specific", dataCat);
        setName("");
        setCatChanged(true);
        
      } catch (error) {

        if (error instanceof AxiosError) {
          setShowMessage(true);
          setNewError(error.response?.data.error || "Error desconocido");
        } 

      } 
    }
  };

  /* Get para editar categoria */
  const handleEdit = async (id: any) => {

    const result = await axios.get(`/api/categories/${id}`, {
      headers: {
        "X-User-Id": userId,
      },
    });

    setCategory(result.data.data);
    setName(result.data.data.name);

    setCatChanged(true);
  };

  /* Eliminar categoria */
  const handleDelete = async (id: any) => {
    const result = await Swal.fire({
      title: `¿Quieres eliminar la categoria ${name}?`,
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
        const result = await axios.delete(`/api/categories/${id}`, {
          headers: {
            "X-User-Id": userId,
          },
        });
        setCatChanged(true);
        Swal.fire({ title: "Categoria eliminada correctamente" });
      } catch (error) {
        Swal.fire({ title: "No se pudo eliminar la categoria" });
      }
    }
  };

  const handleSpec = async() => {
    console.log("Submit");
  }

  useEffect(() => {
    if(showMessage){
      const timer = setTimeout(() => {setShowMessage(false)}, 2000);
      return () => clearTimeout(timer);
    }
  },[newError, showMessage]);

  /* Funcion para añadir propiedad*/
  function addProperty() {
    setProperties((prev) => [...prev, { name: "", values: "" }]); // Editar
    setNameProp((prev) => [...prev, {name: ""}]);
    setValueProp((prev) => [...prev, {value: ""}]);
  }
  
  /* Función para cambiar el nombre de una propiedad */
  function handlePropertyNameChange(index: number, newName: string) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    }); //Editar
    setNameProp((prev) => {
      const nameProp = [...prev];
      nameProp[index] = newName;
      return nameProp;
    });

  }
  
  /* Función para cambiar los valores de una propiedad */
  function handlePropertyValuesChange(index: number, newValues: string) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    }); // Editar

    setValueProp((prev) => {
      const valueProp = [...prev];
      valueProp[index] = newValues;
      return valueProp;
    });
  }
  
  /* Función para eliminar una propiedad */
  function removeProperty(indexToRemove: number) {
    setProperties((prev) => prev.filter((_, pIndex) => pIndex !== indexToRemove));
    setNameProp((prev) => prev.filter((_, pIndex) => pIndex !== indexToRemove));
    setValueProp((prev) => prev.filter((_, pIndex) => pIndex !== indexToRemove));
  }

  console.log(nameProp, valueProp);
  return (
    <div>
        {showMessage && newError.map((err) => (
            <div key={err.path?.[0] || err.message} className="fixed left-1/2 transform -translate-x-1/2 top-12 bg-red-500 text-white py-3 px-5 rounded-md">
                {err.message}
            </div>
        ))}

      <h1 className="titulo">Categorias</h1>
      <div className="border-decoration"></div>
      {/* Formulario para añadir categorias */}
      <form onSubmit={handleSubmit}>
        <div className="w-1/3 flex flex-col">
          <label> Nombre: </label>

          <input
            className="input-default"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div >
            <div className="mb-3">
                <label className="mb-2">Propiedades</label>
                <button type="button" className="btn-default text-sm ml-2" onClick={addProperty}>Añadir nueva propiedad</button>
            </div>
            {properties && properties.map((property, index) => (
                <div className="flex gap-1 mb-1 items-center" key={index}>
                    <input type="text" className="input-sin" value={property.name} onChange={e => handlePropertyNameChange(index, e.target.value)} placeholder="Nombre Propiedad (ej: color)"/>
                    <input type="text" className="input-sin" value={property.values} onChange={e => handlePropertyValuesChange(index, e.target.value)} placeholder="Valores, separado por comas"/>
                    <button type="button" className="btn-danger" onClick={() =>removeProperty(index)}>Eliminar</button>
                </div>
            ))}
        </div>
        
        <button type="submit" className="btn-info h-10 mb-4 self-end">
          Guardar
        </button>
      </form>
      
      {/* Formulario para añadir propiedades */}
      <div className="my-5">
        <h2>Añadir propiedades</h2>
        <select className="w-5/12 sm:w-1/3 my-2 py-2 rounded-md shadow-md" value={selectCate} onChange={(e) => setSelectCate(e.target.value)}>
          <option value="">Seleccione categoria</option>
          {categories.length > 0 && categories.map((category) => (
            <option value={category._id} key={category._id}>{category.name}</option>
          ))}
        </select>
        {selectCate && (
          <div>

          </div>
        )}
      </div>

      {/* Listado de categorias */}
      {!categories || categories.length === 0 ? (
        <div className="my-5">No hay categorias</div>
      ) : (
        <div>
            <h2 className="my-4">Listado de categorias</h2>
            <Table
            data={categories}
            columns={[{ key: "name", label: "Nombre" }]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            />
        </div>
      )}
    </div>
  );
}
