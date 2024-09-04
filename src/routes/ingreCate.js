import express from "express";
import { createIngreCate, deleteById, getListIngreCate } from "../controllers/ingreCate";

const route = express.Router()

route.post("/create-cate", createIngreCate)
route.get("/get-list", getListIngreCate)
route.delete("/delete-cate/:id", deleteById)

export default route