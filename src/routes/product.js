import express from "express";
import { createProduct, getListProduct, getProductById } from "../controllers/product";

const route = express.Router()

route.post("/create-product", createProduct)
route.get("/get-products", getListProduct)
route.get("/get-product/:id", getProductById)

export default route