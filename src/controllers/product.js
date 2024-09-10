import Product from "../models/product";
import ProductIngredient from "../models/productIngredient";
import ProductPrice from "../models/productPrice";
import { convertNameToCode } from "../utils/convertNameToCode";

export const createProduct = async (req, res) => {
    try {
        const { product, priceBySize, ingredients } = req.body.data
        const productData = {
            ...product,
            code: convertNameToCode(product.name)
        }
        const newProduct = await Product(productData).save()
        const productId = newProduct._id

        if (product.priceType === 1) {
            if (priceBySize && priceBySize.length > 0) {
                await ProductPrice({ priceBySize, productId }).save()
            }
        }
        if (ingredients && ingredients.length > 0) {
            await Promise.all(ingredients.map(ingre => ProductIngredient({ ...ingre, productId }).save()))
        }

        res.json({
            status: "success",
            message: "Tạo sản phẩm thành công"
        })

    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}

export const getListProduct = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'productingredients',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'ingredients'
                }
            }
        ])

        res.json(products)
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}

export const getGridData = async (req, res) => {
    try {
        // const { page, limit } = req.query
        // const pageNum = page || 1
        // const limitNum = limit || 10
        // const skip = (pageNum - 1) * limitNum
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                code: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$category"
            },
            {
                $lookup: {
                    from: 'productingredients',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'ingredients',
                    pipeline: [
                        {
                            $project: {
                                priceType: 1,
                                ingredients: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'productpricebysizes',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'priceBySize',
                    pipeline: [
                        {
                            $project: {
                                priceBySize: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$priceBySize"
            }
        ])
        const total = await Product.count()
        res.json({
            status: "success",
            data: products,
            meta: {
                total
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId).select("name img priceType singlePrice status code")
        const productPrice = await ProductPrice.findOne({ productId }).select("priceBySize")
        const productIngredient = await ProductIngredient.find({ productId }).select("priceType ingredients")
        res.json({
            product,
            productPrice,
            productIngredient
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}