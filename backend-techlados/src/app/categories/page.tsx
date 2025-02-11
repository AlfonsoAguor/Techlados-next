"use client"

import { FormEvent, useEffect, useState } from "react"
import axios, {AxiosError} from "axios"
import Swal from "sweetalert2"

export default function CategoryPage() {
    const [ categories, setCategories ] = useState<any[]>([]);
    const [ newError, setNewError ] = useState([]);

    const [ name, setName ] = useState("");
    const [ editedCat, setEditedCat ] = useState(true);

    /* Fetch de categorias */
    useEffect(() => {
        const fetchCat = async () => {
            try {
                if(editedCat){
                    const res = await axios.get('/api/categories');
                    setCategories(res.data.data);
                    setEditedCat(false);
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    setNewError(error.response?.data.error || []);
                }
            }
        } 

        fetchCat();
    }, [editedCat]);

    /* Submit de categorias */
    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = { name };
        const res = axios.post('/api/categories', data);
        setEditedCat(true);
    }

    /* Editar categoria */
    const handleEdit = async(id: any) => {
        console.log(id);
        setEditedCat(true);
    }

    /* Eliminar categoria */
    const handleDelete = async(id: any) => {
        const result = await Swal.fire({
            title: `¿Quieres eliminar la categoria ${name}?`,
            showDenyButton: true,
            denyButtonText: "No",
            confirmButtonText: "Si, eliminar",
            customClass: {
                confirmButton: "swal-confirm", 
                denyButton: "swal-deny"
            }
        });
      
        if (result.isConfirmed) {
            try {
                const result = await axios.delete(`/api/categories/${id}`);
                setEditedCat(true);
                Swal.fire({title: "Categoria eliminada correctamente"});
            } catch (error) {
                Swal.fire({title: "No se pudo eliminar la categoria"});
            }
          }
    }

  return (
    <div>
        <h1 className="titulo">Categorias</h1>
        <div className="border-decoration"></div>

        <form className="mt-3 flex items-end gap-8" onSubmit={handleSubmit}>
            <div className="w-1/3 flex flex-col">
                <label> Nombre: </label>
                <input className="input-default" type="text" name="name" onChange={e => setName(e.target.value)} />
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
                <table className="basic">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat._id}>
                                <td>{cat.name}</td>
                                <td className="flex gap-8">
                                    <button onClick={() => handleEdit(cat._id)} className="btn-warning-outline">Editar</button>
                                    <button onClick={() => handleDelete(cat._id)} className="btn-danger-outline">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  )
}
