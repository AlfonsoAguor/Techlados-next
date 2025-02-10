import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const BrandSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    values: [{
        type: Object
    }],
    category: {
        type: mongoose.Types.ObjectId, 
        ref: 'Category',
    },
},{
    timestamps: true
});

export const Specific = models.Specific || model('Specific', BrandSchema);