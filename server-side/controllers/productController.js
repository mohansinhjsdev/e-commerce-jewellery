import axios from "axios";
import productModel from "../modules/productModel.js";
import slugify from "slugify";
import fs from "fs"

import dotenv from 'dotenv'
import { getPackedSettings } from "http2";
import cloudinary from "../config/cloudinary.js";

dotenv.config()

const apiKey = process.env.METAL_API_KEY; 

const getGoldPricePerGram = async()=>{
    try {
        // fetch gold price in indian rupees
        const res = await axios.get(`https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=INR&symbols=XAU`,{timeout:8000})
        // console.log('get response from gold',res.data)

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

        const {image} = req.body;

        // basic validation
        if(!name || !category || !weight || !makingCharge){
            return res.status(400).send({
                success:false,
                message:"Name, Category, Weight, and MakingCharge are required"
            });
        }

        // fetch live goldprice per gram
        const goldPricePerGram = await getGoldPricePerGram();
        console.log("gold price per gram",goldPricePerGram)
        if(!goldPricePerGram){
            return res.status(500).send({
                success:false,
                message:"Failed to fetch gold price"
            })
        }
         
        //calucate base price = weigth * gold price
        const basePrice = weight * goldPricePerGram;
        console.log("base price", basePrice)

        //final price = base price + making price
        const finalPrice = basePrice + makingCharge;
        console.log("final price", finalPrice)

 

    // upload multiple images to Cloudinary
    let imageUrls = [];

    if(req.files && req.files.length>0){
        for(const files of req.files){
            const result = await cloudinary.uploader.upload(file.path,{
                folder:'products'
            });
            imageUrls.push(result.secure_url)

            //remove file from local stroage
            fs.unlinkSync(file.path)
        }
    }

           // create product object
           const product = new productModel({
            name,
            slug:slugify(name),
            category,
            weight,
            makingCharge,
            description,
            shipping,
            inStock,
            images:imageUrls
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
        const products = await productModel.find({}).populate('category')
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
        const finalPrice = basePrice + makingCharge;
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


// get single product 
export const getSingleProduct = async(req,res) =>{
    try {
        const {id} = req.params;

        const product = await productModel.findById(id).populate('category')

        if(!product){
            return res.status(404).send({
                success:false,
                message:"Product not found"
            })
        }

        //fetch live price per gram 

        const goldPricePerGram = await getGoldPricePerGram();
        if(!goldPricePerGram){
            return res.status(500).send({
                success: false,
                message: "Failed to fetch gold price"
            });
        }

        //ensure proper number conversion
        const weight = Number(product.weight) || 0
        const makingCharge = Number(product.makingCharge) || 0

        const basePrice = weight * goldPricePerGram;
        const finalPrice = basePrice + makingCharge;

        res.status(200).send({
            success:true,
            product:{
                ...product.toObject(),
                finalPrice:finalPrice.toFixed(2),
                goldPricePerGram:goldPricePerGram.toFixed(2)
            }
        })

    } catch (error) {
        console.error("Error fetching single product:", error.message);
        res.status(500).send({
            success: false,
            message: "Error fetching Single product",
            error: error.message
        });
    }
}

//update product

export const updateProduct = async (req,res) =>{
    try {
        const {id} = req.params;
        const { name, category, weight, makingCharge, description, shipping, inStock } = req.body;
        console.log("id",id)

        //final existing product
        const product = await productModel.findById(id);
        if(!product){
            return res.status(404).send({
                success:false,
                message:"Product not found"
            })
        }
        //update fild only if provided

        if(name){
            product.name = name;
            product.slug = slugify(name)
        }

        if(category) product.category = category;
        if(weight) product.weight = Number(weight)
        if (makingCharge) product.makingCharge = Number(makingCharge);
        if (description) product.description = description;
        if(shipping !== undefined) product.shipping = shipping;
        if(inStock !== undefined) product.inStock = inStock 


        //if image provided
        if(req.file){
            product.image.data = fs.readFileSync(req.file.path)
            product.image.contentType = req.file.mimetype;
            fs.unlinkSync(req.file.path);
        }

        await product.save();

       // Fetch live gold price for updated final price
        const goldPricePerGram = await getGoldPricePerGram()
        const basePrice = product.weight * goldPricePerGram;
        const finalPrice = basePrice + makingCharge;

        res.status(200).send({
            success:true,
            message:"Product updated succesfully",
            product:{
                ...product.toObject(),
                finalPrice:finalPrice.toFixed(2),
                goldPricePerGram:goldPricePerGram.toFixed(2)
            }
        })

    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).send({
            success: false,
            message: "Error updating product",
            error: error.message
        });
    }
}

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

