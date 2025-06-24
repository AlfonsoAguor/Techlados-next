import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react'
import { NextResponse } from 'next/server';
import axios from 'axios';

interface Product{
  _id: string;
  name: string;
  description?: string;
  brand: string; 
  category?: string;
  properties?: Record<string, string[]>;
  images: string[];
  price: number;
  specifics: string;
}

interface ProductContextType {
    productData: Product | null;
    setProductData: React.Dispatch<React.SetStateAction<Product | null>>;
    iphoneData: Product | null;
    setIphoneData: React.Dispatch<React.SetStateAction<Product | null>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);


export const ProductProvider = ({ children }: {children: ReactNode}) => {
  const [ productData, setProductData ] = useState<Product | null>(null);
  const [ iphoneData, setIphoneData ] = useState<Product | null>(null);

  const fetchProductData = async () => {

    try {
      const res = await axios.get("/api/product");
      setProductData(res.data);
      const resData = await axios.get("/api/product/iphone");
      setIphoneData(resData.data);
    } catch (error) {
      return NextResponse.json({ message: "Error fetching product data", error: error}, {status: 500});
    }

  }

  useEffect(() => {
    fetchProductData();
  }, []);
  
    return (
    <ProductContext.Provider value={{productData, setProductData, iphoneData, setIphoneData}}>
        {children}
    </ProductContext.Provider>
  )
}

export const useProduct = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (!context) {
      throw new Error('useUser must be used within a ProductProvider');
    }
    return context;
};