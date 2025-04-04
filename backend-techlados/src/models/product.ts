import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    category: {
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
    },
    properties: {
        type: Map,
        of: [String], // Le indicamos que puede tener diferentes propiedades con un array de tipo string
    },
    images: [{
        type: String,
        default: "default.png",
    }],
    price: {
        type: Number,
        default: 0
    },
    specifics: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);
