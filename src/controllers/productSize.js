import ProductSize from "../models/productSize"
import { convertNameToCode } from "../utils/convertNameToCode"

export const createProductSize = async (req, res) => {
    try {
        const { name } = req.body
        const code = convertNameToCode(name)
        await ProductSize({ name, code }).save()
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

export const getListProductSize = async (req, res) => {
    try {
        const size = await ProductSize.find({}).select('name code')
        res.json({
            status: "success",
            data: size
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}