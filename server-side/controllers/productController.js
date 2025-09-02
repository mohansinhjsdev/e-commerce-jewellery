import axios from "axios";
import productModel from "../modules/productModel.js";
import slugify from "slugify";
import fs from "fs"
import dotenv from 'dotenv'
import { getPackedSettings } from "http2";
import cloudinary from "../config/cloudinary.js";
import streamifier from 'streamifier';
import categoryModel from "../modules/categoryModel.js";

dotenv.config()

const apiKey = process.env.METAL_API_KEY; 

const getGoldPricePerGram = async()=>{
    try {
        // fetch gold price in indian rupees
        const res = await axios.get(`https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=INR&symbols=XAU`,{timeout:8000})
        console.log('get response from gold',res.data)

        if(!res.data || !res.data.rates || !res.data.rates.XAU){
            throw new Error("Invalid API response")
        }

        const {base,rates} = res.data;

        const pricePerOnceINR = rates[`${base}XAU`] ?? (rates.XAU ? 1 / rates.XAU : null)
        console.log("price per once",pricePerOnceINR)

        if(!pricePerOnceINR) throw new Error("XAU rate not found in response")

        const pricePerGramINR = pricePerOnceINR / 31.1035; 
        console.log("price per gram", pricePerGramINR)

        // Optional sanity guard (Indian 24k spot typically 5k–8k INR/g)
        if(pricePerGramINR < 1000 || pricePerGramINR >10000){
            console.warn('"Suspicious gold price, check API response:", res.data')
        }

        return pricePerGramINR;


    } catch (error) {
        console.log("Error fetching gold price",error.message)
        return null
    }
}

// create product

export const createProduct =async (req,res) =>{
    try {
        const {name,category,weight,makingCharge,description,shipping,inStock} = req.body;
    
        // basic validation
        if(!name || !category || !weight || !makingCharge){
            return res.status(400).send({
                success:false,
                message:"Name, Category, Weight, and MakingCharge are required"
            });
        }
        

        const numericWeight = Number(weight)
        console.log("numeric weight",numericWeight)
        const numericMakingCharge = Number(makingCharge)
        console.log("Making Charge",numericMakingCharge)

        if(isNaN(numericWeight) || isNaN(numericMakingCharge)){
            return res.status(400).send({
                success: false,
                message: "Weight and MakingCharge must be valid numbers"
            })
        }

        // fetch live goldprice per gram
        const goldPricePerGram = await getGoldPricePerGram();
        console.log("gold price per gram",goldPricePerGram,typeof goldPricePerGram)
        if(!goldPricePerGram){
            return res.status(500).send({
                success:false,
                message:"Failed to fetch gold price"
            })
        }
         
        //calucate base price = weigth * gold price
        const basePrice = numericWeight * goldPricePerGram;
        console.log("base price", basePrice)

        //final price = base price + making price
        const finalPrice = basePrice + numericMakingCharge;
        console.log("final price", finalPrice)

 

    
        // Upload multiple images to Cloudinary
        const imageUploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "Products" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        });

        const uploadedImages = await Promise.all(imageUploadPromises);
        const imageUrls = uploadedImages.map(img => img.secure_url);

           // create product object
           const product = new productModel({
            name,
            slug:slugify(name),
            category,
            weight:numericWeight,
            makingCharge:numericMakingCharge,
            description,
            shipping,
            inStock,
            image:imageUrls,
            createdBy:req.user._id
        })

        // save product
        await product.save();

        res.status(200).send({
            success:true,
            message:"Product created Succesfully",
            product:{
                ...product.toObject(),
                finalPrice:finalPrice.toFixed(2),
                goldPricePerGram: goldPricePerGram.toFixed(2)
            }
        })

    } catch (error) {
        console.log("Error creating Product",error)
        res.status(500).send({
            success:false,
            message:"Error creating product",
            error:error.message
        })
    }
}

// get all product 
export const getAllProducts = async(req,res) =>{
    try {
        const products = await productModel.find({createdBy:req.user._id}).populate('category')
        console.log("products fetch", products)
        if(!products || products.length == 0){
            return res.status(404).send({
                success: false,
                message: "No products found"
            });
        }

        // fetch live gold price 
        const goldPricePerGram = await getGoldPricePerGram();
    if(!goldPricePerGram){
        return res.status(500).send({
            success: false,
            message: "Failed to fetch gold price"
        });
    }

    // Map products and calculate prices dynamically

    const updatedProducts = products.map(product=>{
        const weight = Number (product.weight) || 0;
        const makingCharge = Number(product.makingCharge) || 0;

        const basePrice = weight * goldPricePerGram;
        console.log("base price get",basePrice)
        const finalPrice = basePrice + makingCharge;
        console.log("final price get",finalPrice)

        const imageUrls = product.image.map((_,index)=>{
            
        })

        return {
            ...product.toObject(),
            finalPrice:finalPrice.toFixed(2),
            goldPricePerGram:goldPricePerGram.toFixed(2)
        }
    })

    res.status(200).send({
        success: true,
        count: updatedProducts.length,
        products: updatedProducts
    });
    } catch (error) {
        console.log("Error getting Product",error)
        res.status(500).send({
            success:false,
            message:"Error fetch product",
            error:error.message
        })
    }
}


//get all products for homepage
export const getAllProductsForHome = async(req,res)=>{
    try {
        const products = await productModel.find().populate('category')
        if(!products){
            return res.status(404).send({
                success:false,
                message:"No Product Found"
            })            
        }
        //Gold Price mapping
        const goldPricePerGram = await getGoldPricePerGram()
        console.log("gold price per gram",goldPricePerGram)
        const updatedProducts = products.map(product => {
            const weight = Number(product.weight) || 0;
            // console.log("weight",weight)
            const makingCharge = Number(product.makingCharge) || 0;
            // console.log("makingCharge",makingCharge)
            const basePrice = weight * goldPricePerGram;
            // console.log("base Price",basePrice)
            const finalPrice = basePrice + makingCharge;
            // console.log("final price homepage" ,finalPrice)

            return {
                ...product.toObject(),
                finalPrice: finalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
                goldPricePerGram: goldPricePerGram.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
            }
        })
        res.status(200).send({success:true,count:updatedProducts.length,products:updatedProducts})
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching products", error: error.message });
    }
}


// get Single
export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findById(id).populate('category');
        console.log("product single",)

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }

        // authorization check: only creator admin can access
        // if (!product.createdBy.equals(req.user._id)) {
        //     return res.status(403).send({
        //         success: false,
        //         message: "Unauthorized access to this product"
        //     });
        // }

        const goldPricePerGram = await getGoldPricePerGram();
        if (!goldPricePerGram) {
            return res.status(500).send({
                success: false,
                message: "Failed to fetch gold price"
            });
        }

        const weight = Number(product.weight) || 0;
        const makingCharge = Number(product.makingCharge) || 0;
        const basePrice = weight * goldPricePerGram;
        const finalPrice = basePrice + makingCharge;

        res.status(200).send({
            success: true,
            product: {
                ...product.toObject(),
                finalPrice: finalPrice.toLocaleString('en-IN',{style:'currency',currency:"INR"}),
                goldPricePerGram: goldPricePerGram.toLocaleString('en-IN',{style:'currency',currency:"INR"})
            }
        });

    } catch (error) {
        console.error("Error fetching single product:", error.message);
        res.status(500).send({
            success: false,
            message: "Error fetching product",
            error: error.message
        });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const { name, category, weight, makingCharge, description, shipping, inStock } = req.body;

        // Get product from DB
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ success: false, message: "Product not found" });
        }

        // Handle images
        let updatedImages = [...product.image]; // start with existing images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            updatedImages = [...updatedImages, ...newImages]; // merge old + new
        }

        // Remove any null or empty values
        updatedImages = updatedImages.filter(img => img && img.trim() !== "");

        // Update fields
        product.name = name || product.name;
        product.category = category || product.category;
        product.weight = weight || product.weight;
        product.makingCharge = makingCharge || product.makingCharge;
        product.description = description || product.description;
        product.shipping = shipping || product.shipping;
        product.inStock = inStock || product.inStock;
        product.image = updatedImages;

        await product.save();

        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating product",
            error: error.message
        });
    }
};

  



//delete product 
export const deleteProduct =async (req,res)=>{
    try {
        const {id} = req.params

        const product = await productModel.findByIdAndDelete(id)
        if(!product){
            return res.status(404).send({
                success:false,
                message:"Product not find"
            })
                    }

                    res.status(200).send({
                        success:true,
                        message:"Product delete succesfully"
                    })
    } catch (error) {
        console.error("Error delete product:", error.message);
        res.status(500).send({
            success: false,
            message: "Error delete product",
            error: error.message
        });
    }
}

//filters
export const filterProductsController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};

        if (checked.length > 0) args.category = { $in: checked }; // fix $in
        if (radio.length) args.finalPrice = { $gte: radio[0], $lte: radio[1] };

        let products = await productModel.find(args).populate('category');

        const goldPricePerGram = await getGoldPricePerGram();
        products = products.map(product => {
            const weight = product.weight || 0;
            const makingCharge = product.makingCharge || 0;
            const finalPrice = weight * goldPricePerGram + makingCharge;
            return {
                ...product._doc,
                finalPrice: finalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
            };
        });

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error filtering products",
            error: error.message
        });
    }
};


//product count
export const productCountController = async(req,res)=>{
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In productCout",
            error: error.message
        });
    }
}

//product list base on page
export const productListController = async(req,res)=>{
    try {
       const perPage = 3;
       const page = req.params.page ? req.params.page : 1
       const products = await productModel
       .find({})
       .select("-photo")
       .skip((page-1)*perPage)
       .limit(perPage)
       .sort({createdAt:-1});

       res.status(200).send({
        success:true,
        products,
       })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In per page",
            error: error.message
        });
    }
}

//search product
export const searchProductController = async(req,res)=>{
    try {
        const {keyword} = req.params;
        const results = await productModel.find({
            $or:[
                {name:{$regex: keyword, $options:"i"}},
                {description:{$regex: keyword, $options:"i"}}
            ]
        }).select("-photo")

        res.json(results)
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Search",
            error: error.message
        });
    }
}

// get product by category
export const productCategoryController = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category Not found"
            });
        }

        let products = await productModel.find({ category: categoryId }).populate('category');

        const goldPricePerGram = await getGoldPricePerGram();
        products = products.map(product => {
            const weight = product.weight || 0;
            const makingCharge = product.makingCharge || 0;
            const finalPrice = weight * goldPricePerGram + makingCharge;
            return {
                ...product._doc,
                finalPrice: finalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
            };
        });

        res.status(200).send({
            success: true,
            category,
            products
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to fetch category products",
            error: error.message
        });
    }
};

