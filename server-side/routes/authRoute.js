import express from "express"
import { loginController, registerController, testSign } from "../controllers/authController.js";
import { isAdmin, requireSign } from "../middleware/authMiddleware.js";

//router object

const router = express.Router()

//Register
router.post('/register',registerController)
router.post('/login',loginController)

//test routes
router.get('/test',requireSign,isAdmin,testSign)

export default router;