import mongoose, { Schema } from "mongoose";

const ingredientSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: true
        },
        category: {
            ref: 'IngredientCategory',
            type: mongoose.SchemaTypes.ObjectId
        },
        code: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model('Ingredient', ingredientSchema);