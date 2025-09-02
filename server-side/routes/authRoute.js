import express from "express"
import { loginController, registerController,forgotPasswordController ,testSign, updateProfileController } from "../controllers/authController.js";
import { isAdmin, requireSign } from "../middleware/authMiddleware.js";

//router object
const router = express.Router()

//Register
router.post('/register',registerController)
router.post('/login',loginController)

//forgot password
router.post('/forgot-password',forgotPasswordController)

//test routes
router.get('/test',requireSign,isAdmin,testSign)


// User protected Routes (Auth)
router.get('/user-auth',requireSign,(req,res)=>{
    res.status(200).send({ok:true})
})

// admin protected Routes (Auth)
router.get('/admin-auth',requireSign,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

//update profile
router.put('/profile',requireSign,updateProfileController)


export default router;