import express from "express";
import { createIngredient, deleteById, getListIngredient } from "../controllers/ingredient";

const route = express.Router()

route.post("/create-ingredient", createIngredient)
route.get("/get-list", getListIngredient)
route.delete("/delete-ingredient/:id", deleteById)

export default route