import IngredientDiary from "../../models/ingredient/ingredientDiary";

export const createDiary = async (req, res) => {
    try {
        await IngredientDiary(req.body).save()
        res.status(400).json({
            status: "success",
            message: ""
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}

export const getDiary = async (req, res) => {
    try {
        const { page, limit } = req.query
        const pageNum = page || 1
        const limitNum = limit || 10
        const skip = (pageNum - 1) * limitNum
        const data = await IngredientDiary.find({}).skip(skip).limit(limitNum).select("user content createdAt")
        const count = await IngredientDiary.count()

        res.json({
            status: 'success',
            meta: {
                total: count
            },
            data
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        })
    }
}