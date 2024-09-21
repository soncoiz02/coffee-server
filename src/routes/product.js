import express from "express";
import { createProduct, getGridData, getListProduct, getProductById, getProductFilterValueOptions, getTotalAllProductCanCreate } from "../controllers/product/product";

const route = express.Router()

route.post("/create-product", createProduct)
route.get("/get-products", getListProduct)
route.get("/get-product/:id", getProductById)
route.get("/get-grid-data", getGridData)
route.get("/total-product-can-create", getTotalAllProductCanCreate)
route.get("/filter-value-options", getProductFilterValueOptions)

export default route