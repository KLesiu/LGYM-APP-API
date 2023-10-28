const bodyParser = require("body-parser")
const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()



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


// Start listening
app.listen(process.env.PORT,()=>console.log(`Server start at port ${process.env.PORT}`))


