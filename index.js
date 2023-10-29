const bodyParser = require("body-parser")
const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const auth = require("./routes/auth")

// Mongoose connection
mongoose.set("strictQuery",false)
const mongoDB = process.env.MONGO_CONNECT
main().catch((err)=>console.log(err))
async function main(){
    await mongoose.connect(mongoDB)
}

// Config app
const app=express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())


// Passport
const passport = require("./config/passport").passportConfig
passport()


// Routes
app.use('/api',auth)


// Start listening
app.listen(process.env.PORT,()=>console.log(`Server start at port ${process.env.PORT}`))


