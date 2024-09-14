import mongoose, { Schema } from "mongoose";

const ingredientDiarySchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model('IngredientDiaryCategory', ingredientDiarySchema);