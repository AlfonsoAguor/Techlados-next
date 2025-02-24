import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    properties: [{ type: Schema.Types.ObjectId, ref: "Property"}],
},{
    timestamps: true
});

export const Category = models.Category || model('Category', CategorySchema);