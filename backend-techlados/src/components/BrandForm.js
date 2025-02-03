import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BrandForm({
  name: existingName,
  categories: existingCategories,
  _id,
}) {
  const [name, setName] = useState(existingName || "");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(existingCategories ||[]);

  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
        setCategories(result.data);
    });
  }, [])

  async function saveBrand(e) {
    e.preventDefault();
  
    try {
      const data = { name, categories: selectedCategories };
      if(_id){
        const resBrand = await axios.put("/api/brand", {...data, _id});
        if(resBrand.status === 201){
          setName("");  
          setSelectedCategories([]);
          router.push("/brands");
        }
      }else{
        const resBrand = await axios.post("/api/brand", data);
        if(resBrand.status === 201){
          setName("");  
          setSelectedCategories([]);
          router.push("/brands");
        }
      }
  
    } catch (error) {
      console.error("Error al crear la marca:", error.response?.data || error.message);
    }
  }
  

  function handleCheckboxChange(e) {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories(prev => [...prev, value]);
    } else {
      setSelectedCategories(prev => prev.filter(categoryId => categoryId !== value));
    }
  }

  return (
    <div>
      <form onSubmit={saveBrand} className="flex flex-col">
        <label className="my-2">Nombre de la marca: </label>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-1/3"
        ></input>
        
        <label className="my-2">Categorías:</label>
        <div className=" flex flex-col items-start ml-4">
          {categories?.map((category) =>
            category.parent === null && (
              <div key={category._id} className="flex items-center">
                <input
                  type="checkbox"
                  value={category._id}
                  checked={selectedCategories.includes(category._id)}
                  onChange={handleCheckboxChange}
                  id={`category-${category._id}`}
                  className="mt-2 mr-2"
                />
                <label htmlFor={`category-${category._id}`} className="text-black">{category.name}</label>
              </div>
            )
          )}
        </div>

        <button type="submit" className="btn-primary w-24 my-2">
            Guardar
        </button>
      </form>
    </div>
  );
}
