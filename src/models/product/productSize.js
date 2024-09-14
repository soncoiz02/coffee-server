import mongoose, { Schema } from "mongoose";

const sizeSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model('ProductSize', sizeSchema);