import express from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct, } from "../controllers/productController.js";
import { isAdmin, requireSign } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();


// getProducts, updateProduct, deleteProduct
router.post("/create-product",requireSign,isAdmin, upload.array('images',5),createProduct);
router.get('/get-all',getAllProducts)

// get single product
router.get('/get-single/:id',getSingleProduct)

//update porduct
router.put('/update-product/:id',requireSign,isAdmin,updateProduct)

//delete product
router.delete('/delete-product/:id',requireSign,isAdmin,deleteProduct)


export default router;
