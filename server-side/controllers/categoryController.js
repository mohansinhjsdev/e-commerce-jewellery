import categoryModel from "../modules/categoryModel.js";

export const createCategoryController = async(req,res) =>{
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({message:'Name is Required'})
        }

        const existingCategory = await categoryModel.findOne({
            name:{$regex:`^${name}$`,$options:'i'},
            createdBy:req.user._id})
        if(existingCategory){
            return res.status(400).send({
                success:false,
                message:"Category Already Exists"
            })
        }

        const category = await new categoryModel({
            name,
            createdBy:req.user._id
        }).save()
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
        const category = await categoryModel.find({createdBy:req.user._id})
        console.log("catgory",category)

        const uniqueCategories = []
        const catgorySet = new Set();

        category.forEach(cat =>{
            if(!catgorySet.has(cat.name)){
                catgorySet.add(cat.name);
                uniqueCategories.push(cat)
            }
        })
    

        res.status(200).send({
            success:true,
            message:"All Categories List",
            category:uniqueCategories,
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

// get all catgory for homepage

export const getAllCatgoriesForHome = async(req,res) =>{
    try {
        const categories = await categoryModel.find().select("name slug")

        if(!categories || categories.length === 0){
            return res.status(404).send({
                success: false,
                message: "No categories found"
            });        
        }

        res.status(200).send({
            success: true,
            message: "All categories fetched successfully",
            count: categories.length,
            categories
        });
    } catch (error) {
        console.error("Error fetching category:", error.message);
        res.status(500).send({
            success: false,
            message: "Error fetching category",
            error: error.message
        });
    }
}

//single controller
export const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });

        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            });
        }

        // authorization check: only creator admin can access
        if (!category.createdBy.equals(req.user._id)) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized access to this category"
            });
        }

        res.status(200).send({
            success: true,
            message: "Category fetched successfully",
            category
        });

    } catch (error) {
        console.error("Error fetching category:", error.message);
        res.status(500).send({
            success: false,
            message: "Error fetching category",
            error: error.message
        });
    }
};


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