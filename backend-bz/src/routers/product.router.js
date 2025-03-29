import { UploadProducts,getAllProucts,getProduct } from "../controllers/product.controller.js";
import express from "express"
import { upload } from "../middlewares/multer.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"


const productRouter = express.Router()

productRouter.post("/upload", authMiddleware, upload.single("media"), UploadProducts)
productRouter.get("/getall", getAllProucts)
productRouter.get("/get/:id", getProduct)


export {
    productRouter
}