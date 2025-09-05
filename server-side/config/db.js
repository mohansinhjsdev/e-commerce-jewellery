import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config()

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connected to the database")
        console.log("DB URL from env:", process.env.DATABASE_URL);
    } catch (error) {
        console.error("NOt connected to database",error.message)
        process.exit(1)   
    }
}

export default connectDB;

