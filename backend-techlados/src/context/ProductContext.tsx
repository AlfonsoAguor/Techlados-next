import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../../types/product";
import { Variant } from "../../types/variant";

// Define el tipo del contexto
interface ProductContextType {
    productsData: Product[] | any;
    setProductsData: React.Dispatch<React.SetStateAction<Product[] | any>>;
    productData: Product | null;
    setProductData: React.Dispatch<React.SetStateAction<Product | null>>;
    variantsInProduct: Variant[] | any;
    setVariantsInProduct: React.Dispatch<React.SetStateAction<Product[] | any>>;
  }

// Creamos el contexto con un valor por defecto
const ProductContext = createContext<ProductContextType | undefined>(undefined);

/* 
  Creamos el provider que englobara todos los componentes 
  En el definiremos las variables que podremos utilizar, como los datos del usuario
*/
export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [ productData, setProductData ] = useState<Product | null>(null);
    const [ productsData, setProductsData ] = useState<Product[] | any>([]);
    const [ variantsInProduct, setVariantsInProduct ] = useState<Variant[] | any>([]);
  
    return (
      <ProductContext.Provider value={{ 
        productData, 
        setProductData, 
        productsData,
        setProductsData,
        variantsInProduct,
        setVariantsInProduct
        }}>
        {children}
      </ProductContext.Provider>
    );
};

export const useProduct = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (!context) {
      throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};