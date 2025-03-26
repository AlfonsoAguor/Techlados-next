import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const VariantSchema = new Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    properties: [{
        name: String,
        value: String
    }],
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    /*images: [{
        type: String,
        default: "default.png",
    }]*/
}, {
    timestamps: true
});

export const Variant = models.Variant || model("Variant", VariantSchema);
