import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        require: true
    },
    category: {
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
        require: true
    },
    images: [{
        type: String,
        default: "default.png",
    }],
    specifics: [{
        type: mongoose.Types.ObjectId,
        ref: 'Specific',
    }],
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'Brand',
        require: true
    },
}, {
    timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);
