"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";

import { useUser } from "@/context/UserContext";
import { Variant } from "../../../../../types/variant";
import { Product } from "../../../../../types/product";

function EditVariant() {
  const params = useParams();
  const productId = params.id;
  const { userData } = useUser();
  const userId = userData?._id;

  const [variantsInProduct, setVariantsInProduct] = useState<Variant[] | any>([]);
  const [ product, setProduct ] = useState<Product[] | any>([]);

  const [newError, setNewError] = useState<{ path?: string[]; message: string }[]>([]);

  /* Fetch de Variant y Product */
  useEffect(() => {
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
  }, []);

  console.log("Variantes: ", variantsInProduct);
  console.log("Producto: ", product);

  return (
    <>
        <h2>Variantes de {product.name}</h2>
    </>
  );
}

export default EditVariant;
