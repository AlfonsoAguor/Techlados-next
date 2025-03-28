export interface Variant {
    _id: string;
    product: string;
    properties: {name: string; value: string }[];
    stock: number;
    price: number;
}