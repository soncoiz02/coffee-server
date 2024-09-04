import mongoose, { Schema } from "mongoose";

const ingredientQuantitySchema = new Schema(
    {
        ingredient: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Ingredient'
        },
        quantity: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

const productIngredientSchema = new Schema(
    {
        priceType: {
            type: String,
            required: true
        },
        ingredients: [ingredientQuantitySchema],
        productId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product'
        },
    }
)

export default mongoose.model('ProductIngredient', productIngredientSchema);