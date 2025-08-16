import { request } from "express";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../modules/userModel.js"
import jwt from "jsonwebtoken"

export const registerController = async(req,res)=>{
    try {

        const {name,email,password,number,address} = req.body;

        console.log("Request Body",req.body)
        //validation
        if(!name || !email || !password || !number || !address){
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
        const user = await new userModel({name,email,number,address,password:hashedPassword}).save()

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
            },
            token,
        })

    } catch (error) {
        console.log("Login Error",error)
        res.status(500).json({message:"Server Error",error})
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