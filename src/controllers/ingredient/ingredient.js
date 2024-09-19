import Ingredient from "../../models/ingredient/ingredient"
import IngredientDiary from "../../models/ingredient/ingredientDiary"
import { convertNameToCode } from "../../utils/convertNameToCode"
import { getIngredientFilterOptions } from "../../utils/getFilterOption"
import { getIngredientDiaryContent } from "../../utils/ingredientDairyContent"

export const createIngredient = async (req, res) => {
    try {
        const data = req.body
        const mappedData = data.map(item => ({
            ...item,
            code: convertNameToCode(item.name)
        }))
        const ingredient = await Ingredient.insertMany(mappedData)
        const diaryContent = getIngredientDiaryContent('create', { ingredient })
        await IngredientDiary({
            user: "Son Dzaivcl",
            content: diaryContent
        }).save()

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
        const filterOptions = getIngredientFilterOptions(req.query)
        const ingredients = await Ingredient.find({ ...filterOptions }).skip(skip).limit(limitNum).populate("category", "name code").select("name quantity unit status code category")
        const count = await Ingredient.countDocuments({ ...filterOptions })
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

export const updateIngredientQuantity = async (req, res) => {
    try {
        const { id } = req.params
        const { currentQuantity, additionalQuantity, type } = req.body
        let quantity = 0
        if (type === 'add-quantity') {
            quantity = +currentQuantity + +additionalQuantity
        }
        else if (type === 'remove-quantity') {
            quantity = +currentQuantity - +additionalQuantity
        }
        const resData = await Ingredient.findByIdAndUpdate({ _id: id }, { quantity }, { new: true })
        const diaryContent = getIngredientDiaryContent(type, {
            ingredient: resData,
            updateData: {
                quantity: additionalQuantity
            }
        })
        await IngredientDiary({
            user: "Son Dzaivcl",
            content: diaryContent
        }).save()
        res.json({
            status: 'success',
            message: `Đã ${type === 'add-quantity' ? 'thêm vào' : 'bớt'} ${resData.name} ${additionalQuantity}(${resData.unit})`
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}

export const existIngredientByCode = async (req, res) => {
    try {
        const { code } = req.query
        const data = await Ingredient.findOne({ code })
        if (data) {
            return res.json({
                exist: true,
                message: `${data.name} đã tồn tại`
            })
        }

        res.json({
            exist: false,
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}