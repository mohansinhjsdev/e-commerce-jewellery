import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Category name is required"],
        trim:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

categorySchema.index({name :1,createdBy:1},{unique:true})

export default mongoose.model("Category",categorySchema)