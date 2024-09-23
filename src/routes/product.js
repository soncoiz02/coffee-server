import express from "express";
import { createProduct, getGridData, getListProduct, getProductByCode, getProductById, getProductFilterValueOptions, getTotalAllProductCanCreate } from "../controllers/product/product";

const route = express.Router()

route.post("/create-product", createProduct)
route.get("/get-products", getListProduct)
route.get("/get-product/:id", getProductById)
route.get("/get-grid-data", getGridData)
route.get("/total-product-can-create", getTotalAllProductCanCreate)
route.get("/filter-value-options", getProductFilterValueOptions)
route.get("/get-by-code/:code", getProductByCode)

export default route