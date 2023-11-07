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

exports.getTrainingHistory=async(req,res,next)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    if(findUser){
        const trainings = await Training.find({user:findUser})
        if(trainings.length>0) return res.status(200).send({trainingHistory:trainings})
        else return res.status(404).send({msg:'You dont have trainings!'})
    }
    else return res.status(404).send({msg:'Error, we dont find You in our database. Please logout and login one more time.'})
}

exports.getCurrentTrainingSession=async(req,res,next)=>{
    const id = req.params.id
    const findTraining = await Training.findById(id)
    if(findTraining){
        return res.status(200).send({training:findTraining})
    }
    else return res.status(404).send({msg:'We dont find your training session!, Please logout and login one more time'})
}