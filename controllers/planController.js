const {body, validationResult}= require("express-validator")
const User = require("../models/User")
const Plan = require('../models/Plan')
const asyncHandler = require("express-async-handler")
require("dotenv").config()


exports.setPlanConfig=async(req,res,next)=>{
    const days = +req.body.days
    const name = req.body.name
    const id = req.params.id
    if(!name || !days) return res.send({msg:'All fields are required'})
    if(days< 1 || days > 7) return res.send({msg:'You have to choose days number between 1-7'})
    const findUser = await User.findById(id)
    const currentPlan = await Plan.create({user:findUser,name:name,trainingDays:days})
    await findUser.updateOne({plan:currentPlan})
    return res.send({msg:"Created"})
}

exports.getPlanConfig=async(req,res,next)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    const findPlan = await Plan.findOne({user:findUser})
    
    return res.send({count:findPlan.trainingDays})
}

exports.setPlan=async(req,res,next)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    const findPlan = await Plan.findOne({user:findUser})
    const days = req.body.days.days
    if(days.length === 1){
        await findPlan.updateOne({planA:days[0].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 2){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 3){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 4){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 5){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 6){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises,planF:days[5].exercises})
        return res.send({msg:'Updated'})
    }
    else if(days.length === 7){
        await findPlan.updateOne({planA:days[0].exercises,planB:days[1].exercises,planC:days[2].exercises,planD:days[3].exercises,planE:days[4].exercises,planF:days[5].exercises,planG:days[6].exercises})
        return res.send({msg:'Updated'})
    }
    else{
        return res.send({msg:"Error, try again"})
    }
    

}

exports.getPlan= async(req,res,next)=>{
    const id = req.params.id
    const findUser = await User.findById(id)
    const findPlan = await Plan.findOne({user:findUser})
    if(findPlan) return res.status(200).send({data:{ planA: findPlan.planA,
        planB: findPlan.planB,
        planC: findPlan.planC,
        planD: findPlan.planD,
        planE: findPlan.planE,
        planF: findPlan.planF,
        planG: findPlan.planG}
       
    })
    else return res.status(404).send({data:'Didnt find'})
}