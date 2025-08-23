import slugify from "slugify";
import categoryModel from "../modules/categoryModel.js";

export const createCategoryController = async(req,res) =>{
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({message:'Name is Required'})
        }

        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category Already Exists"
            })
        }

        const category = await new categoryModel({name,slug:slugify(name)}).save()
        console.log("category",category)

        res.status(201).send({
            success:true,
            message:"new category created",
            category

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Category'
        })
    }
}

//update controller
export const updateCategoryController = async(req,res)=>{
    try {
        const {name} = req.body;
        const {id} = req.params

        const category = await categoryModel.findByIdAndUpdate(id,{name, slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"Category Update Succesfully",
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error While updating category'
        })
    }
}


//get all categroy
export const categroyController = async(req,res)=>{
    try {
        const category = await categoryModel.find({})

        res.status(200).send({
            success:true,
            message:"All Categories List",
            category,
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error While getting all categories'
        })
    }
}

//single controller
export const singleCategoryController = async(req,res)=>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})
        console.log(category)
        res.status(200).send({
            success:true,
            message:"Get Single Category Successfully",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error While getting single categories'
        })
    }
}

//delete category
export const deleteCategoryController = async (req,res) =>{
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Category deleted Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error While delete categories'
        })
    }
}