export interface Product {
    _id: string;
    name: string;
    description?: string;
    brand: string;
    category: string;
    properties: Record<string, string[]>;
    images: string[];
    specifics?: string; 
}