const bodyParser = require("body-parser")
const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()



// Config app
const app=express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())


// Start listening
app.listen(process.env.PORT,()=>console.log(`Server start at port ${process.env.PORT}`))


