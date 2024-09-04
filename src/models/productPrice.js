import mongoose, { Schema } from "mongoose";

const priceBySizeSchema = new Schema(
    {
        size: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'ProductSize',
        },
        price: {
            type: Number,
            required: true
        }
    }
)

const productPriceSchema = new Schema(
    {
        priceBySize: [priceBySizeSchema],
        productId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Product',
        }
    },
    { timestamps: true }
)

export default mongoose.model('ProductPriceBySize', productPriceSchema);