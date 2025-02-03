import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

export default function Categories() {
    const [name, setName] = useState('');
    const [newCategory, setNewCategory] = useState(true);
    const [editedCategory, setEditedCategory] = useState();
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

    useEffect(() => {

        if(newCategory){
            axios.get('/api/categories').then(result => {
                setCategories(result.data);
            });

            setNewCategory(false);
        }
        
    }, [newCategory]);

    async function saveCategory(e){
        e.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: Array.isArray(p.values) 
                    ? p.values // Si ya es un array, lo deja igual
                    : typeof p.values === "string"
                        ? p.values.split(',') // Si es un string, lo divide
                        : [] // Si es otro caso (undefined, null), asigna un array vacío
            })),
        }

        if(editedCategory){
            await axios.put('/api/categories', {...data, _id:editedCategory._id});
            setEditedCategory('');
        } else {
            await axios.post('/api/categories', data);
        }
        
        setName('');
        setParentCategory('');
        setNewCategory(true);
        setProperties([]);
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties);
    }

    async function deleteCategory(category) {
        const result = await Swal.fire({
            title: `¿Quieres eliminar ${category.name}?`,
            showDenyButton: true,
            confirmButtonText: "No",
            denyButtonText: "Si, eliminar"
        });

        if (result.isDenied) {
            try {
                await axios.delete('/api/categories', { data: category });
                setNewCategory(true);
                Swal.fire({title: "Categoria eliminada"});
            } catch (error) {
                Swal.fire({title: "No se pudo eliminar la categoria"});
            }
        }
    }

    /*Funcion para añadir propiedades */
    function addProperty(){
        /* Al añadir propiedades, se guarda la anterior y añada una nueve con name y values */
        setProperties(prev => {
            return [...prev, {name:'', values: ''}];
        });
    }
    
    function handlePropertyNameChange(index, property, newName){
        setProperties(prev => {
            const properties = [...prev]; // Copia el arreglo actual
            properties[index].name = newName; // Actualiza el nombre de la propiedad en el índice especificado
            return properties; // Retorna el nuevo arreglo con la propiedad modificada
        })
    }

    function handlePropertyValuesChange(index, property, newValues){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

  return (
    <Layout>
      <h1>Categorias</h1>
      <form onSubmit={saveCategory}>
      <label>{editedCategory ? `Editar categoria ${editedCategory.name}` : 'Nueva categoria'}</label>
        <div className="w-full flex flex-row gap-2 mb-3">
            <input type="text" className="my-3 w-6/12 sm:w-1/3" placeholder={"nombre categoria"} onChange={e => setName(e.target.value)} value={name}/>

            <select className="w-5/12 sm:w-1/5 my-3" value={parentCategory} onChange={e => setParentCategory(e.target.value)}>
                <option value="">Categoria padre</option>
                {categories?.map((category) => (
                    <option value={category._id} key={category._id}>{category.name}</option>
                ))}
            </select>
        </div>
        
        <div>
            <div className="mb-3">
                <label className="mb-2">Propiedades</label>
                <button type="button" className="btn-default text-sm ml-2" onClick={addProperty}>Añadir nueva propiedad</button>
            </div>
            {properties && properties.map((property, index) => (
                <div className="flex gap-1 mb-1" key={index}>
                    <input type="text" className="mb-0" value={property.name} onChange={e => handlePropertyNameChange(index, property, e.target.value)} placeholder="Nombre Propiedad (ej: color)"/>
                    <input type="text" className="mb-0" value={property.values} onChange={e => handlePropertyValuesChange(index, property, e.target.value)} placeholder="Valores, separado por comas"/>
                    <button type="button" className="btn-default mb-0" onClick={() =>removeProperty(index)}>Eliminar</button>
                </div>
            ))}
        </div>
        <div className="flex gap-2">
        <button className="btn-primary">Guardar</button>
            {editedCategory && (
                <button className="btn-danger">Cancelar</button>
            )}
        </div>
      </form>

    {!editedCategory && (
        <div>
            <h3 className="mt-10 mb-5">Listado de las categorias</h3>
            <ul>
                {!categories.length ? (
                    <div>
                        No hay categorias
                    </div>
                ) : (
                    <div className="bg-white p-4 shadow-lg">
                        <div className="border-b-2 pb-1">
                            <ul className="flex flex-row w-full font-bold sm:text-lg">
                                <li className="w-1/3">Categoria</li>
                                <li className="w-1/3">Padre</li>
                            </ul>
                        </div>
                        {categories.map((category) => (
                            <div key={category._id} className="w-full my-2 flex flex-row">
                                <ul className="flex flex-row w-full items-center">
                                    <li className="w-1/3">{category.name}</li>
                                    <li className="w-1/3">{category.parent ? <span>{category.parent.name}</span> : "Raíz"}</li>
                                    <li className="w-1/3 flex flex-row flex-wrap gap-2">
                                        <button onClick={() => editCategory(category)} className="btn-warning">Editar</button>
                                        <button onClick={() => deleteCategory(category)} className="btn-danger">Eliminar</button>
                                    </li>
                                </ul>
                            </div>
                            ))
                        }
                    </div>
                )}

            </ul>
        </div>
    )}
    </Layout>
  );
}
