import { request } from "express";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../modules/userModel.js"
import jwt from "jsonwebtoken"

export const registerController = async(req,res)=>{
    try {

        const {name,email,password,number,address,answer} = req.body;

        console.log("Request Body",req.body)
        //validation
        if(!name || !email || !password || !number || !address || !answer){
            return res.status(400).json({message:"Enter All Inputs field"})
        }

        // existing user
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.status(409).json({message:"User Already exists with this email"})
        }
        //register user
        const hashedPassword = await hashPassword(password)

        //save
        const user = await new userModel({name,email,number,address,password:hashedPassword,answer}).save()

        res.status(200).json({message:"User Registred Succesfully",success:true,user})


    } catch (error) {
        console.log("Registration Error",error)
        res.status(500).json({message:"Server Error",error})
    }
}


// Login

export const loginController = async(req,res) =>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(401).send({message:"Invalid email and password"})
        }

        const user = await userModel.findOne({email})

        if(!user){
            return res.status(404).send({message:"User Not registred this email"})
        }

        const match = await comparePassword(password,user.password)

        if(!match){
            return res.status(405).send({message:"Invalid Password",success:false})
        }

        const token = jwt.sign({_id:user._id },process.env.JWT_SECRET,{expiresIn:'7d'})

        res.status(200).json({
            message:"User Sucussfully Login",
            success:true,
            user:{
                name:user.name,
                email:user.email,
                number:user.number,
                address:user.address,
                role:user.role
            },
            token,
        })

    } catch (error) {
        console.log("Login Error",error)
        res.status(500).json({message:"Server Error",error})
    }
}

//forgot password controller

export const forgotPasswordController = async(req,res)=>{
    try {
        const {email,answer,newPassword} = req.body;
        console.log(email,answer,newPassword)

        if(!email){
            res.status(400).send({message:"Email is Required"})
        }


        if(!answer){
            res.status(400).send({message:"Answer is Required"})
        }

        if(!newPassword){
            res.status(400).send({message:"New Password is Required"})
        }

        //check 
        const user = await userModel.findOne({email,answer})
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Wrong Email or Answer"
            })
        }

        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})

        res.status(200).json({
            success:true,
            message:"Password Reset Succesfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong",error})
    }
}

//test controller

export const testSign = (req,res)=>{
    try {
        res.status(200).send({message:"Protected routes"})
    } catch (error) {
        console.log(error)
        res.send({error})
    }
}


//update profile
export const updateProfileController = async(req,res)=>{
    try {
        const {name,email,password,number,address} = req.body;
        const user = await userModel.findById(req.user._id)

        //password
        if(password && password.length < 6){
            return res.json({error:"Password is required and 6 charcter long"})
        }

        const hashedPassword = password ? await hashPassword(password) : undefined

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            email:email || user.email,
            password:hashedPassword || user.password,
            number:number || user.number,
            address:address || user.address
        },{new:true})

        res.status(200).send({
            success:true,
            message:"Update Susccesfully",
            updatedUser,
        })
    } catch (error) {
        console.log("Login Error",error)
        res.status(500).json({
            success:false,
            message:"Error While updating password",error})
    }
}