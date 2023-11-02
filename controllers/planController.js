const {body, validationResult}= require("express-validator")
const User = require("../models/User")
const Plan = require('../models/Plan')
const asyncHandler = require("express-async-handler")
require("dotenv").config()


exports.setPlanConfig=async(req,res,next)=>{
    const days = +req.body.days
    const name = req.body.name
    if(!name || !days) return res.send({msg:'All fields are required'})
    if(days< 1 || days > 7) return res.send({msg:'You have to choose days number between 1-7'})
    const findUser = await User.findById(req.params.id)
    const currentPlan = await Plan.create({user:findUser,name:name,trainingDays:days})
    await findUser.updateOne({plan:currentPlan})
    return res.send({msg:"Created"})
}