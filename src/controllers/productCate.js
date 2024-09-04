import ProductCategory from "../models/category"
import { convertNameToCode } from "../utils/convertNameToCode"

export const createProductCate = async (req, res) => {
    try {
        const { name } = req.body
        const code = convertNameToCode(name)
        await ProductCategory({ name, code }).save()
        res.json({
            status: "success",
            message: "Tạo mới danh mục sản phẩm thành công"
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}

export const getListProductCate = async (req, res) => {
    try {
        const categories = await ProductCategory.find({}).select('name code')
        res.json({
            status: "success",
            data: categories
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}