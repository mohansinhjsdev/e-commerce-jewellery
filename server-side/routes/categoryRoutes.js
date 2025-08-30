import express from 'express'
import { isAdmin, requireSign } from '../middleware/authMiddleware.js';
import { categroyController, createCategoryController, deleteCategoryController, getAllCatgoriesForHome, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js';

const router = express.Router();

//routes
//create category
router.post('/create-category',requireSign,isAdmin,createCategoryController)

//update category
router.put('/update-category/:id',requireSign,isAdmin,updateCategoryController)

//get all category
router.get('/get-category',requireSign,isAdmin, categroyController)

//single category
router.get('/single-category/:slug',singleCategoryController)

//delete Category
router.delete('/delete-category/:id',requireSign,isAdmin,deleteCategoryController)

//public Routes
router.get('/all-categories',getAllCatgoriesForHome)

export default router