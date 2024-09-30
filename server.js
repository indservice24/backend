import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import mongoose from "mongoose"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import serviceRouter from "./routes/serviceRoute.js"
import orderRouter from "./routes/orderRoute.js"
import partnerRouter from "./routes/partnerRoute.js"
import contactRouter from "./routes/contactRoute.js"
import path from "path/win32"

// import blogRouter from "./routes/blogRoute.js"



// App config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()







// middlewares
app.use(express.json({ limit: '50mb' }))
app.use(cors())

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/service',serviceRouter)
app.use('/api/order',orderRouter)
app.use('/api/partner',partnerRouter)
app.use('/api/contact',contactRouter)
// app.use('/api/blog',blogRouter)
// app.use("/upload", express.static(path.join(serviceRouter, "upload")))



app.get('/',(req,res) => {
    res.send("API WORKING")
})

app.listen(port,() => console.log("server started on PORT: " + port))
