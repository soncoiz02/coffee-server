import IngredientCategory from "../../models/ingredient/ingredientCategory"
import { convertNameToCode } from "../../utils/convertNameToCode"

export const createIngreCate = async (req, res) => {
    try {
        const { name } = req.body
        const code = convertNameToCode(name)
        await IngredientCategory({ name, code }).save()
        res.json({
            status: "success",
            message: "Tạo mới danh mục nguyên liệu thành công"
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}

export const getListIngreCate = async (req, res) => {
    try {
        const categories = await IngredientCategory.find({}).select('name code')
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

export const deleteById = async (req, res) => {
    try {
        await IngredientCategory.findByIdAndDelete(req.query.id)
        res.json({
            status: "success",
            message: "Xóa danh mục thành công"
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}