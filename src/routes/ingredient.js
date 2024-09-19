import express from "express";
import { createIngredient, deleteById, existIngredientByCode, getIngredientGridData, getListIngredient, updateIngredientQuantity } from "../controllers/ingredient/ingredient";
import { getDiary } from "../controllers/ingredient/ingredientDiary";

const route = express.Router()

route.post("/create-ingredient", createIngredient)
route.get("/get-list", getListIngredient)
route.get("/get-grid-data", getIngredientGridData)
route.delete("/delete-ingredient/:id", deleteById)
route.get("/get-diary", getDiary)
route.get("/exist-by-code", existIngredientByCode)
route.put('/update-quantity/:id', updateIngredientQuantity)

export default route