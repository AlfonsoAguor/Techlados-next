"use client"

import { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { useParams } from "next/navigation"

import { useUser } from "@/context/UserContext"
import { Variant } from "../../../../../types/variant"
import { Product } from "../../../../../types/product"

function EditVariant() {
  const params = useParams();
  const productId = params.id;
  const { userData } = useUser();
  const userId = userData?._id;

  const [ variantsInProduct, setVariantsInProduct ] = useState<Variant[] | any>([]);
  const [ product, setProduct ] = useState<Product[] | any>([]);

  const [ propertyNames, setPropertyNames ] = useState([]);

  const [ updatedVariants, setUpdatedVariants ] = useState<{ [key: string]: { price: number; stock: number } }>({});

  const [ newError, setNewError ] = useState<{ path?: string[]; message: string }[]>([]);
  const [ showMessage, setShowMessage ] = useState(false);

  /* Fetch de Variant y Product */
  useEffect(() => {

    if(!productId) return;

    const fetchProdInVariant = async () => {
      try {
        const resVarInPro = await axios.get(
          `/api/variant/product/${productId}`,
          {
            headers: {
              "X-User-Id": userId,
            },
          }
        );

        setVariantsInProduct(resVarInPro.data.data);

        // Inicializamos los valores de las diferentes variantes
        const initialUpdates: { [key: string]: { price: number; stock: number } } = {};
        resVarInPro.data.data.forEach((variant: Variant) => {
          initialUpdates[variant._id] = { price: variant.price, stock: variant.stock };
        });
        setUpdatedVariants(initialUpdates);

      } catch (error) {
        if (error instanceof AxiosError) {
          setNewError(error.response?.data.error || []);
        }
      }
    };

    const fetchProduct = async () => {
        try {
          const resProd = await axios.get(
            `/api/products/${productId}`,
            {
              headers: {
                "X-User-Id": userId,
              },
            }
          );
  
          setProduct(resProd.data.data);
        } catch (error) {
          if (error instanceof AxiosError) {
            setNewError(error.response?.data.error || []);
          }
        }
      }; 
    
    fetchProdInVariant();
    fetchProduct();

  }, [productId])

  /* Almacena los nombres de las propiedades */
  useEffect(() => {
    if(variantsInProduct.length > 0 ){
      const properties = variantsInProduct[0]?.properties.map((property: any)=> property.name);
      setPropertyNames(properties);
    }
  },[variantsInProduct])

  /* Funcion para editr lo valores de stock y precio */
  const handleEdit = (variantId: string, field: "price" | "stock", value: number) => {
    setUpdatedVariants((prev) => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        [field]: value,
      },
    }));
  };

  /* Submit */
  const handleSubmit = async(id: string) => {
    try {
      const res = await axios.put(`/api/variant/product/${id}`, updatedVariants[id], {
        headers: { "X-User-Id": userId },
      });

      if(res.status){
        axios.put(`/api/products/${product._id}`, { updatedVariants }, {
          headers: { "X-User-Id": userId },
        });
      }

    } catch (error: any) {
      if (error instanceof AxiosError) {
        setNewError(error.response?.data.error || []);
        setShowMessage(true);
      }
    }
  }

  /* UseEffect de errores */
  useEffect(() => {
    if(showMessage){
      const timer = setTimeout(() => {setShowMessage(false)}, 2000);
      return () => clearTimeout(timer);
    }
  },[newError, showMessage]);
  
  return (
    <>
      {showMessage && newError.map((err) => (
        <div key={err.path?.[0] || err.message} className="fixed left-1/2 transform -translate-x-1/2 top-12 bg-red-500 text-white py-3 px-5 rounded-md">
          {err.message}
        </div>
      ))}

      {variantsInProduct.length > 0 ? (
        <div>
          <h2 className="mb-4">Variantes de {product.name}</h2>
          <table className="basic">
            <thead>
              <tr>
                {propertyNames.map((prop: any) => (
                  <th key={prop}>{prop}</th>
                ))}
                <th>Precio</th>
                <th>Cantidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {variantsInProduct.map((variant: any) => (
                <tr key={variant._id}>
                  {variant.properties.map((prop: any) => (
                    <td key={prop._id}>{prop.value}</td>
                  ))}
                  <td>
                    <input 
                      type="number" 
                      value={updatedVariants[variant._id]?.price}
                      onChange={(e) => handleEdit(variant._id, "price", Number(e.target.value))}
                    ></input>
                  </td>
                  <td>
                    <input 
                      type="number" 
                      value={updatedVariants[variant._id]?.stock}
                      onChange={(e) => handleEdit(variant._id, "stock", Number(e.target.value))}
                    ></input>
                  </td>
                  <td>
                    <button className="btn-success" onClick={() => handleSubmit(variant._id)}>Guardar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      ) : (
        <div>No hay variantes para {product.name}</div>
      )}
        
    </>
  );
}

export default EditVariant;
