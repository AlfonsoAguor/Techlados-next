import Layout from "@/components/Layout";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Brands() {
  const [ brands, setBrands ] = useState();
  const [ newBrands, setNewBrands ] = useState(true);
  
  useEffect(() => {
    if(newBrands) {
      axios.get('/api/brand').then(res => {
        setBrands(res.data);
      });
      setNewBrands(false);
    }
  }, [newBrands]);

    async function deleteBrand(brand) {
      const result = await Swal.fire({
        title: `¿Quieres eliminar ${brand.name}?`,
        showDenyButton: true,
        confirmButtonText: "No",
        denyButtonText: "Si, eliminar"
      });
  
      if (result.isDenied) {
        try {
          await axios.delete('/api/brand', {data: brand._id});
          setNewBrands(true);
          Swal.fire({title: "Marca eliminada"});
        } catch (error) {
          Swal.fire({title: "No se pudo eliminar la marca"});
        }
      }
    }
  
  return (
    <Layout>
      <Link className="bg-slate-500 text-white py-1 px-2 rounded-md text-sm sm:text-base"  href={'/brands/new'}>
        Nueva marca
      </Link>
      <div className="mt-5 w-full md:w-1/2">
        <h3>Listado de marcas</h3>
        <ul className="mt-5">
          {!brands || brands.length === 0 ? (
            <div>
              No hay marcas
            </div>
          ):(
            <div className="bg-white p-4 shadow-lg">
              <div className="border-b-2 pb-1">
                  <ul className="flex flex-row w-full font-bold sm:text-lg">
                      <li className="w-1/2">Marcas</li>
                  </ul>
              </div>
              {brands.map((brand) => (
              <div key={brand._id} className="w-full my-2 flex flex-row">
                <ul className="flex flex-row w-full items-center">
                  <li className="w-1/2">{brand.name}</li>
                  <li className="w-1/2 flex flex-row flex-wrap gap-2 justify-end mr-2">
                    <Link href={'/brands/edit/' + brand._id} className="btn-warning">Editar</Link>
                    <button onClick={() => deleteBrand(brand)} className="btn-danger">Eliminar</button>
                  </li>
                </ul>
              </div>
              ))
            }
          </div>
          )}
        </ul>
      </div>
    </Layout>
  );
}
