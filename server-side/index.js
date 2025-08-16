import express from "express";
import dotenv from 'dotenv'
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import cors from "cors"



const app = express()
dotenv.config()

//middelwares
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))


app.use(express.json())
app.use(morgan('dev'))

//database connect
connectDB();

const PORT = process.env.PORT || 5000

// routes

app.use('/api/auth',authRoutes)


//rest api
app.get("/",(req,res)=>{
    res.send({
        message:"Welcome to MERNKART application"
    })
})


// listen

app.listen(PORT,()=>{
    console.log(`Server runing on PORT number ${PORT}`)
})
