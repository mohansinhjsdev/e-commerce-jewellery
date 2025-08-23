import JWT from "jsonwebtoken"
import userModel from "../modules/userModel.js"

export const requireSign = async (req,res,next)=>{
    try {

        const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success:false,
            message:"Authorization token missing"
        })
    }

        const token = authHeader.split(" ")[1]
        const decode = JWT.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (error) {
        console.log(error)
    }
}

// admin access

export const isAdmin = async(req,res,next)=>{
    try {   
        const user = await userModel.findById(req.user._id)
        if(user.role !== 1){
            return res.status(403).send({
                success:false,
                message:"UnAuthorized Access"
            })
        } else{
            next();
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({message:"Error in Admin Side"})
    }
}