import mongoose from "mongoose";

const goldRateSchema = new mongoose.Schema({
    rate:{
        type:Number,
        required:true,
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})

export default mongoose.model('GoldRate',goldRateSchema)