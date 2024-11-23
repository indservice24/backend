import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoute.js"
import serviceRouter from "./routes/serviceRoute.js"
import orderRouter from "./routes/orderRoute.js"
import partnerRouter from "./routes/partnerRoute.js"
import contactRouter from "./routes/contactRoute.js"
import phoneRouter from "./routes/phoneRoute.js"
import phoneBookRouter from "./routes/phoneBookRoute.js"
import fs from 'fs'
import path, { dirname } from "path"




// App config
const app = express()
const port = process.env.PORT || 4000
connectDB()






// middlewares
app.use(express.json({ limit: '100mb' }))
app.use(cors())




//api endpoints
app.use('/api/user',userRouter)
app.use('/api/service',serviceRouter)
app.use('/api/order',orderRouter)
app.use('/api/partner',partnerRouter)
app.use('/api/contact',contactRouter)
app.use('/api/phone',phoneRouter)
app.use('/api/phonebook',phoneBookRouter)



app.use("/api/images",express.static('upload'))



app.get('/',(req,res) => {
    res.send("API WORKING")
})

// Add a 404 handler for unhandled routes
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exist.")
})

// Add a global error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port,() => console.log("server started on PORT: " + port))
