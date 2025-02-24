"use client";

import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useUser } from "@/context/UserContext";
import Table from "@/components/Table";

import ChevronUp from "@/components/ChevronUp";
import ChevronDowns from "@/components/ChevronDown";

export default function CategoryPage() {
  const { userData } = useUser();
  const userId = userData?._id;

  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [catChanged, setCatChanged] = useState(true);
  const [category, setCategory] = useState<any | null>(null);
  const [ showCatList, setShowCatList ] = useState(false);
  const [ selectedProp, setSelectedProp ] = useState<string[]>([]);

  const [ properties, setProperties ] = useState<any[]>([]);
  const [ property, setProperty ] = useState<any | null>(null);
  const [ propChanged, setPropChanged] = useState(true);
  const [ nameProp, setNameProp ] = useState("");
  const [ valueProp, setValueProp ] = useState("");
  const [ showPropList, setShowPropList ] = useState(false);
  
  const [newError, setNewError] = useState<{ path?: string[], message: string }[]>([]);
  const [ showMessage, setShowMessage ] = useState(false);

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


  useEffect(() => {
    const fetchProp = async () => {
      try {
        if (propChanged) {
          const res = await axios.get("/api/property");
          const propComma = res.data.data.map((property: any) => {
            return {
              ...property,
              values: property.values.join(",")
            };
          });

          setProperties(propComma);
          setPropChanged(false);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setNewError(error.response?.data.error || []);
        }
      }
    };

    fetchProp();
  }, [propChanged]);

  /* Submit de categorias */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (category && category._id) {
      /* Actualizar */
      try {
        const data = { name, id: category._id, properties: selectedProp };
        const res = await axios.put("/api/categories", data, {
          headers: {
            "X-User-Id": userId,
          },
        });
        setCategory([]);
        setSelectedProp([]);
        setName("");
        setCatChanged(true);
      } catch (error) {

        if (error instanceof AxiosError) {
          setShowMessage(true);
          setNewError(error.response?.data.error || "Error desconocido");
        }
      }

    } else {
      /* Crear nueva categoria */
      try {
        const data = { name, properties: selectedProp };
        const res = await axios.post("/api/categories", data, {
          headers: {
            "X-User-Id": userId,
          },
        });
        setSelectedProp([]);
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
    setSelectedProp(result.data.data.properties);

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

  /* Funcion para seleccionar categorias */
  const handleCheckboxChange = (propId: string) => {
    setSelectedProp((prevSelected) =>
        prevSelected.includes(propId)
            ? prevSelected.filter((id) => id !== propId)
            : [...prevSelected, propId]
    );
  };

  /* UseEffect de errores */
  useEffect(() => {
    if(showMessage){
      const timer = setTimeout(() => {setShowMessage(false)}, 2000);
      return () => clearTimeout(timer);
    }
  },[newError, showMessage]);

  /* Submit de Propiedades */
  const handleProp = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const valuesArray = valueProp.split(",").map(value => value.trim());

    try {
      if(property && property._id){
        /* Actualizar propiedades */
        const dataProp = {name: nameProp, values: valuesArray, id: property._id};
        const resProp = await axios.put("/api/property", dataProp, {
          headers: {
            "X-User-Id": userId,
          },
        });

        if(resProp.status === 200){
          setPropChanged(true);
          setNameProp("");
          setValueProp("");
        }

      } else {
        /* Crear nueva propiedad */
        const dataProp = {name: nameProp, values: valuesArray};
        const resProp = await axios.post("/api/property", dataProp, {
          headers: {
            "X-User-Id": userId,
          },
        });
        if(resProp.status === 201){
          setPropChanged(true);
          setNameProp("");
          setValueProp("");
        }
      }
      
    } catch (error) {
      if (error instanceof AxiosError) {
        setShowMessage(true);
        setNewError(error.response?.data.error || "Error desconocido");
      }
    }
  }

  /* Get para editar propiedades */
  const handleEditProp = async (id: any) => {
    const res = await axios.get(`/api/property/${id}`, {
      headers: {
        "X-User-Id": userId,
      },
    });
    const propComma = res.data.data.values.join(",");
    setProperty(res.data.data);
    setNameProp(res.data.data.name);
    setValueProp(propComma);

    setCatChanged(true);
  };

  /* Eliminar propiedad */
  const handleDeleteProp = async (id: any) => {
      const result = await Swal.fire({
        title: `¿Quieres eliminar la propiedad ${name}?`,
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
          const result = await axios.delete(`/api/property/${id}`, {
            headers: {
              "X-User-Id": userId,
            },
          });
          setPropChanged(true);
          Swal.fire({ title: "Propiedad eliminada correctamente" });
        } catch (error) {
          Swal.fire({ title: "No se pudo eliminar la propiedad" });
        }
      }
  };

  return (
    <div>
        {showMessage && newError.map((err) => (
            <div key={err.path?.[0] || err.message} className="fixed left-1/2 transform -translate-x-1/2 top-12 bg-red-500 text-white py-3 px-5 rounded-md">
                {err.message}
            </div>
        ))}

      {/* Formulario para añadir categorias */}
      <h1 className="titulo">Categorias</h1>
      <div className="border-decoration"></div>
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

        <div>
        <label>Seleccione propiedades:</label><br/>
        {properties.map((property) => (
          <label key={property._id} className="mr-6">
            <input
              type="checkbox"
              value={property._id}
              checked={selectedProp.includes(property._id)}
              onChange={() => handleCheckboxChange(property._id)}
            />
            {property.name}
          </label>
        ))}
        </div>

        <button type="submit" className="btn-info h-10 mb-4 self-end">
        {category && category._id ? ("Actualizar") : ("Crear")} categoria
        </button>
      </form>
      
      {/* Formulario para añadir propiedades */}
      <div className="my-5">
        <h1  className="titulo">Propiedades</h1>
        <div className="border-decoration"></div>

        <form onSubmit={handleProp}>
          <div className="flex gap-4">
            <input type="text" className="input-sin w-1/3" value={nameProp} onChange={e => setNameProp(e.target.value)} placeholder="Nombre Propiedad (ej: color)"/>
            <input type="text" className="input-sin w-2/3" value={valueProp} onChange={e => setValueProp(e.target.value)} placeholder="Valores, separado por comas"/>
          </div>
          <button type="submit" className="btn-info h-10 mb-4 self-end">
            {property && property._id ? ("Actualizar") : ("Crear")} propiedad
          </button>
        </form>
      </div>

      {/* Listado de categorias */}
      <button onClick={e => setShowCatList(!showCatList)} className={showCatList ? "accordion-active" : "accordion"}>
        Listado de categorias {showCatList ? (<ChevronDowns/>) : (<ChevronUp />)}
      </button>
      <div className={showCatList ? "block" : "hidden"}>
        {!categories || categories.length === 0 ? (
          <div className="my-5">No hay categorias</div>
        ) : (
          <div>
              <Table
              data={categories}
              columns={[{ key: "name", label: "Nombre" }]}
              onEdit={handleEdit}
              onDelete={handleDelete}
              />
          </div>
        )}
      </div>

      {/* Listado de propiedades */}
      <button onClick={e => setShowPropList(!showPropList)} className={showPropList ? "accordion-active" : "accordion"}>
        Listado de propiedades {showPropList ? (<ChevronDowns/>) : (<ChevronUp />)}
      </button>
      <div className={showPropList ? "block" : "hidden"}>
        {!properties || properties.length === 0 ? (
          <div className="my-5">No hay propiedades</div>
        ) : (
          <div>
              <Table
              data={properties}
              columns={[
                { key: "name", label: "Nombre" },
                { key: "values", label: "Valores"}
              ]}
              onEdit={handleEditProp}
              onDelete={handleDeleteProp}
              />
          </div>
        )}
      </div>
    </div>
  );
}

