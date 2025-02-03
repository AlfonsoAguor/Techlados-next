import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        require: true
    },
    images: [{
        type: String,
        default: "default.png",
    }],
    category: {type: mongoose.Types.ObjectId, ref: 'Category', default: null},
    subCategory: {type: mongoose.Types.ObjectId, ref: 'Category', default: null},
    properties: {type: Object}
}, {
    timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);
