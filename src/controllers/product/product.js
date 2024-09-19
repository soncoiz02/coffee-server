import Product from "../../models/product/product";
import ProductIngredient from "../../models/product/productIngredient";
import ProductPrice from "../../models/product/productPrice";
import { convertNameToCode } from "../../utils/convertNameToCode";
import { getProductFilterOptions } from "../../utils/getFilterOption";

export const createProduct = async (req, res) => {
    try {
        const { product, priceBySize, ingredients } = req.body.data
        const productData = {
            ...product,
            code: convertNameToCode(product.name)
        }
        const newProduct = await Product(productData).save()
        const productId = newProduct._id

        await ProductPrice({ priceBySize, productId }).save()
        await Promise.all(ingredients.map(ingre => ProductIngredient({ ...ingre, productId }).save()))

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
        const { page, limit } = req.query
        const pageNum = page || 1
        const limitNum = limit || 10
        const skip = (pageNum - 1) * limitNum
        const filterOptions = getProductFilterOptions(req.query)
        const data = await Product.aggregate([
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
                            $lookup: {
                                from: 'ingredients',
                                localField: 'ingredients.ingredient',
                                foreignField: '_id',
                                as: 'productIngredients',
                            }
                        },
                        {
                            $project: {
                                "_id": 0,
                                priceType: 1,
                                data: {
                                    $map: {
                                        input: "$ingredients",
                                        as: "ingre",
                                        in: {
                                            quantity: "$$ingre.quantity",
                                            ingredient: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$productIngredients",
                                                            as: "ingredientDetail",
                                                            cond: { $eq: ["$$ingredientDetail._id", "$$ingre.ingredient"] }
                                                        }
                                                    },
                                                    0
                                                ]
                                            }
                                        }
                                    }
                                }
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
                                priceBySize: 1,
                                "_id": 0,
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$priceBySize"
            },
            {
                $addFields: {
                    priceBySize: "$priceBySize.priceBySize"
                }
            },
            {
                $lookup: {
                    from: 'productsizes',
                    localField: 'priceBySize.size',
                    foreignField: 'code',
                    as: 'size',
                }
            },
            {
                $project: {
                    name: 1,
                    img: 1,
                    priceType: 1,
                    singlePrice: 1,
                    status: 1,
                    code: 1,
                    category: 1,
                    ingredients: 1,
                    priceBySize: {
                        $map: {
                            input: "$priceBySize",
                            as: "price",
                            in: {
                                price: "$$price.price",
                                size: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$size",
                                                as: "priceDetail",
                                                cond: { $eq: ["$$priceDetail.code", "$$price.size"] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                },
            },
            {
                $match: { ...filterOptions }
            },
            {
                $facet: {
                    resultData: [
                        {
                            $skip: skip
                        },
                        {
                            $limit: limitNum
                        }
                    ],
                    totalRecords: [{ $count: "count" }]
                }
            }
        ])
        res.json({
            status: "success",
            data: data[0].resultData,
            meta: {
                total: data[0].totalRecords[0].count
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

export const getTotalAllProductCanCreate = async (req, res) => {
    try {
        const { page, limit } = req.query
        const pageNum = page || 1
        const limitNum = limit || 10
        const skip = (pageNum - 1) * limitNum

        const listProduct = await Product.find({}).select("_id name")

        const ingredientByProduct = await Promise.all(listProduct.map(p => ProductIngredient.find({ productId: p._id }).populate({
            path: "ingredients",
            populate: {
                path: "ingredient",
                select: "quantity name"
            }
        })))

        let totalProductWillCreate = []

        ingredientByProduct.forEach((data, index) => {
            data.forEach(item => {
                const listQuantity = []
                item.ingredients.forEach(ingre => {
                    const totalIngreQuantity = ingre.ingredient.quantity
                    const productIngreQuantity = ingre.quantity
                    if (totalIngreQuantity > 0 && productIngreQuantity > 0) {
                        listQuantity.push(Math.floor(totalIngreQuantity / productIngreQuantity))
                    }
                    else {
                        listQuantity.push(0)
                    }
                })

                const total = Math.min(...listQuantity)

                totalProductWillCreate.push({
                    productId: item.productId,
                    size: item.priceType,
                    total
                })
            })
        })

        const productCanCreate = listProduct.map((product) => {
            const productItem = product._doc
            const total = totalProductWillCreate.filter(p => p.productId.toString() === productItem._id.toString()).map(p => ({ size: p.size, totalProduct: p.total }))
            return {
                ...productItem,
                productCanCreate: total
            }
        })

        res.json(productCanCreate)
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}