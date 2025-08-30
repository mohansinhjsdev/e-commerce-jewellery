import express from "express";
import { createProduct, deleteProduct, getAllProducts, getAllProductsForHome, getSingleProduct, updateProduct, filterProductsController, productCountController, productListController} from "../controllers/productController.js";
import { isAdmin, requireSign } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();


// getProducts, updateProduct, deleteProduct
router.post("/create-product",requireSign,isAdmin, upload.array('images',5),createProduct);
router.get('/get-all',requireSign,isAdmin,getAllProducts)
// for homepage 
router.get('/all-products',getAllProductsForHome)



// get single product
router.get('/get-single/:id',getSingleProduct)

//update porduct
router.put('/update-product/:id',requireSign,isAdmin,upload.array('images',5),updateProduct)

//delete product
router.delete('/delete-product/:id',requireSign,isAdmin,deleteProduct)

//filter products
router.post('/product-filter',filterProductsController)

//product count 
router.get('/product-count',productCountController)

//product per page
router.get('/product-list/:page',productListController)


export default router;
