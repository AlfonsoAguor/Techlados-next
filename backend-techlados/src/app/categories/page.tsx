"use client";

import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useUser } from "@/context/UserContext";
import Table from "@/components/Table";

export default function CategoryPage() {
  const { userData } = useUser();
  const userId = userData?._id;

  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [catChanged, setCatChanged] = useState(true);
  const [category, setCategory] = useState<any | null>(null);

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

  useEffect(() => {
    if(showMessage){
      const timer = setTimeout(() => {setShowMessage(false)}, 2000);
      return () => clearTimeout(timer);
    }
  },[newError, showMessage]);

  return (
    <div>
        {showMessage && newError.map((err) => (
            <div key={err.path?.[0] || err.message} className="fixed left-1/2 transform -translate-x-1/2 top-12 bg-red-500 text-white py-3 px-5 rounded-md">
                {err.message}
            </div>
        ))}

      <h1 className="titulo">Categorias</h1>
      <div className="border-decoration"></div>

      <form className="mt-3 flex items-end gap-8" onSubmit={handleSubmit}>
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
        <button type="submit" className="btn-info h-10 mb-4 self-end">
          Guardar
        </button>
      </form>

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
