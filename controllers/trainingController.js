const User = require("../models/User")
const Training = require("../models/Training")
require("dotenv").config()

exports.addTraining=async(req,res,next)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    const day = req.body.day
    const exercises = req.body.training
    const createdAt = req.body.createdAt
    const date = new Date(createdAt).toString()
    const newTraining = await Training.create({user:findUser,type:day,exercises:exercises,createdAt:date})
    if(newTraining) res.status(200).send({msg:'Training added'})
    else res.status(404).send({msg:'Error, We didnt add your training!'})
}