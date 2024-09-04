import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        img: {
            type: String
        },
        priceType: {
            type: Number,
            default: 0
        },
        singlePrice: {
            type: Number,
        },
        status: {
            type: Boolean,
            default: true,
        },
        code: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default mongoose.model('Product', productSchema);