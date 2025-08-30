import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.ObjectId,
        ref: "Category",
        required: true
    },
    weight: {
        type: Number, // in grams
        required: true
    },
    makingCharge: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type:[String],
        default:[]

},
    shipping:{
        type:Boolean
    },
    inStock:{
        type:Boolean,
        default:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
}, { timestamps: true });

// Virtual field for live price (will not store in DB)
productSchema.virtual('finalPrice').get(function () {
    return 0; // Will calculate in controller dynamically
});

export default mongoose.model("Product", productSchema);
