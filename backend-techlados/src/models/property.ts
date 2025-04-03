import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const PropertySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    values: [{
        type: String
    }],
},{
    timestamps: true
});

export const Property = models.Property || model('Property', PropertySchema);