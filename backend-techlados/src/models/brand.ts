import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const BrandSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category: [{
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
    }],
},{
    timestamps: true
});

export const Brand = models.Brand || model('Brand', BrandSchema);