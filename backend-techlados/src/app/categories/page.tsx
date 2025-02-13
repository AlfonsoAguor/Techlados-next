"use client"

import { FormEvent, useEffect, useState } from "react"
import axios, {AxiosError} from "axios"
import Swal from "sweetalert2"
import { useUser } from "@/context/UserContext"

export default function CategoryPage() {
    
    const { userData } = useUser();
    const userId = userData?._id;

    const [ categories, setCategories ] = useState<any[]>([]);
    const [ newError, setNewError ] = useState([]);

    const [ name, setName ] = useState("");
    const [ catChanged, setCatChanged ] = useState(true);
    const [ category, setCategory ] = useState<any | null>(null);

    /* Fetch de categorias */
    useEffect(() => {
        const fetchCat = async () => {
            try {
                if(catChanged){
                    const res = await axios.get('/api/categories');
                    setCategories(res.data.data);
                    setCatChanged(false);
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    setNewError(error.response?.data.error || []);
                }
            }
        } 

        fetchCat();
    }, [catChanged]);

    /* Submit de categorias */
    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(category && category._id){
            const data = { name, id: category._id}
            const res = axios.put('/api/categories', data);
            setCategory([]);
            setName("");
            setCatChanged(true);
        } else {
            const data = { name };
            const res = axios.post('/api/categories', data);
            setName("");
            setCatChanged(true);
        }
    }

    /* Get para editar categoria */
    const handleEdit = async(id: any) => {
        const result = await axios.get(`/api/categories/${id}`, {
            headers: {
                "X-User-Id": userId,
            }
        });

        setCategory(result.data.data);
        setName(result.data.data.name);

        setCatChanged(true);
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
                const result = await axios.delete(`/api/categories/${id}`, {
                    headers: {
                        "X-User-Id": userId,
                    }
                });
                setCatChanged(true);
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
                
                <input className="input-default" type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
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
