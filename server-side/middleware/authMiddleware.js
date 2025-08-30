import JWT from "jsonwebtoken"
import userModel from "../modules/userModel.js"
export const requireSign = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      console.log("auth header", authHeader);
  
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Authorization token missing",
        });
      }
  
      let token;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        token = authHeader; // support raw token
      }
  
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token not provided",
        });
      }
  
      const decode = JWT.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      next();
    } catch (error) {
      console.log(error);
  
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
  
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired, please login again",
        });
      }
  
      return res.status(500).json({
        success: false,
        message: "Authentication Error",
      });
    }
  };
  

// admin access

export const isAdmin = async(req,res,next)=>{
    try {   
        const user = await userModel.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }

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