import express from "express";
import { createProductSize, getListProductSize } from "../controllers/product/productSize";

const route = express.Router()

route.post("/create-size", createProductSize)
route.get("/get-list-size", getListProductSize)

export default route