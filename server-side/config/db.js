import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv"


dotenv.config()

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connected to the database")
    } catch (error) {
        console.error("NOt connected to database",error.message)
        process.exit(1)   
    }
}

export default connectDB;

