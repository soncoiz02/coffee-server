import Ingredient from "../models/ingredient"
import { convertNameToCode } from "../utils/convertNameToCode"

export const createIngredient = async (req, res) => {
    try {
        const data = req.body
        const mappedData = data.map(item => ({
            ...item,
            code: convertNameToCode(item.name)
        }))
        console.log(mappedData);
        await Promise.all(mappedData.map(item => Ingredient(item).save()))
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

export const getIngredientGridData = async (req, res) => {
    try {
        const { page, limit } = req.query
        const pageNum = page || 1
        const limitNum = limit || 10
        const skip = (pageNum - 1) * limitNum
        const ingredients = await Ingredient.find({}).skip(skip).limit(limitNum).populate("category", "name code").select("name quantity unit status code category")
        const count = await Ingredient.count()
        res.json({
            status: "success",
            meta: {
                total: count
            },
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