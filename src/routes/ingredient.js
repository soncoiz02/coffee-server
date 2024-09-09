import express from "express";
import { createIngredient, deleteById, getIngredientGridData, getListIngredient } from "../controllers/ingredient";

const route = express.Router()

route.post("/create-ingredient", createIngredient)
route.get("/get-list", getListIngredient)
route.get("/get-grid-data", getIngredientGridData)
route.delete("/delete-ingredient/:id", deleteById)

export default route