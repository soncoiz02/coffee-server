import Ingredient from "../models/ingredient"
import { convertNameToCode } from "../utils/convertNameToCode"

export const createIngredient = async (req, res) => {
    try {
        const { name } = req.body
        const code = convertNameToCode(name)
        await Ingredient({ ...req.body, code }).save()
        res.json({
            status: "success",
            message: "Thêm nguyên liệu thành công"
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}

export const getListIngredient = async (req, res) => {
    try {
        const ingredients = await Ingredient.find({}).populate("category", "name code").select("name quantity unit status code category")
        res.json({
            status: "success",
            data: ingredients
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
        await Ingredient.findByIdAndDelete(req.query.id)
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