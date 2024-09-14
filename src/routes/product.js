import express from "express";
import { createProduct, getGridData, getListProduct, getProductById } from "../controllers/product/product";

const route = express.Router()

route.post("/create-product", createProduct)
route.get("/get-products", getListProduct)
route.get("/get-product/:id", getProductById)
route.get("/get-grid-data", getGridData)

export default route