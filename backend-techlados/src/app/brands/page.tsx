"use client"

import { FormEvent, useEffect, useState } from "react"
import axios, {AxiosError} from "axios"
import Swal from "sweetalert2"
import { useUser } from "@/context/UserContext"
import Table from "@/components/Table"

export default function CategoryPage() {
    
    const { userData } = useUser();
    const userId = userData?._id;

    
    const [ brands, setBrands ] = useState<any[]>([]);
    const [ brand, setBrand ] = useState<any | null>(null);
    const [ name, setName ] = useState("");
    const [ brandChanged, setBrandChanged ] = useState(true);

    const [ categories, setCategories ] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

    const [newError, setNewError] = useState<{ path?: string[], message: string }[]>([]);
    const [ showMessage, setShowMessage ] = useState(false);

    /* Fetch de categorias */
    useEffect(() => {
        const fetchCat = async () => {
            try {
                if(brandChanged){
                    const resCat = await axios.get('/api/categories');
                    const resBrand = await axios.get('/api/brands');
                    setBrands(resBrand.data.data);
                    setCategories(resCat.data.data);
                    setBrandChanged(false);
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    setNewError(error.response?.data.error || []);
                }
            }
        } 

        fetchCat();
    }, [brandChanged]);

    /* Submit de marca */
    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(brand && brand._id){
            try {
                const data = { name, id: brand._id, categories: selectedCategories}
                const res = await axios.put('/api/brands', data);
                setBrand([]);
                setName("");
                setSelectedCategories([]);
                setBrandChanged(true);
            } catch (error) {
                if(error instanceof AxiosError){
                    setNewError(error.response?.data.error || []);
                }
            }

        } else {
            const data = { name, categories: selectedCategories };
            try {
                const res = await axios.post('/api/brands', data);
                setName("");
                setSelectedCategories([]);
                setBrandChanged(true);
            } catch (error) {
                if(error instanceof AxiosError){
                    setNewError(error.response?.data.error || []);
                }
            }
        }
    }

    /* Get para editar marca */
    const handleEdit = async(id: any) => {

        const result = await axios.get(`/api/brands/${id}`, {
            headers: {
                "X-User-Id": userId,
            }
        });

        setBrand(result.data.data);
        setName(result.data.data.name);
        // De esta manera almacenamos los _id en un array de objetos
        setSelectedCategories(result.data.data.category.map((cat: any) => cat._id)); 

        setBrandChanged(true);
    }

    /* Eliminar marca */
    const handleDelete = async(id: any) => {
        const result = await Swal.fire({
            title: `¿Quieres eliminar la marca ${name}?`,
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
                const result = await axios.delete(`/api/brands/${id}`, {
                    headers: {
                        "X-User-Id": userId,
                    }
                });
                setBrandChanged(true);
                Swal.fire({title: "Marca eliminada correctamente"});
            } catch (error) {
                Swal.fire({title: "No se pudo eliminar la marca"});
            }
          }
    }

    /* Funcion para seleccionar categorias */
    const handleCheckboxChange = (categoryId: string) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter((id) => id !== categoryId)
                : [...prevSelected, categoryId]
        );
    };

    useEffect(() => {
        if (newError.length > 0) {
            setShowMessage(true);
        }
    }, [newError]);  

    useEffect(() => {
        if(showMessage){
          const timer = setTimeout(() => {setShowMessage(false)}, 2000);
          return () => clearTimeout(timer);
        }
      },[newError, showMessage]);

      console.log(brands);

  return (
    <div>
        {showMessage && newError.map((err) => (
            <div key={err.path?.[0] || err.message} className="fixed left-1/2 transform -translate-x-1/2 top-12 bg-red-500 text-white py-3 px-5 rounded-md">
                {err.message}
            </div>
        ))}


        <h1 className="titulo">Marcas</h1>
        <div className="border-decoration"></div>

        <form className="mt-3" onSubmit={handleSubmit}>
            <div className="w-1/3">
                <label className="label-bold"> Nombre: </label>
                <input className="input-default" type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div>
                <label className="label-bold">Selccione las categorias: </label><br />
                {categories?.map((category) => (
                    <label key={category._id} className="mr-6">
                        <input 
                        type="checkbox" 
                        value={category._id} 
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCheckboxChange(category._id)}
                        />
                        {category.name}
                    </label>
                ))}
            </div>
            <button type="submit" className="btn-info h-10 mb-4 self-end">
                Guardar
            </button>
        </form>

        {!brands || brands.length === 0 ? (
            <div className="my-5">No hay marcas</div>
        ) : (
            <div>
                <h2 className="my-4">Listado de marcas</h2>
                <Table
                    data={brands}
                    columns={[{ key: "name", label: "Nombre" }]}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        )}

    </div>
  )
}