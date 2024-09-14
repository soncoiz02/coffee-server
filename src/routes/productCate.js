import express from "express";
import { createProductCate, getListProductCate } from "../controllers/product/productCate";

const route = express.Router()

route.post("/create-cate", createProductCate)
route.get("/get-list", getListProductCate)

export default route