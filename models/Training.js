const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TrainingSchema= new Schema({
    user: {type:Schema.Types.ObjectId,ref:"User",required:true},
    type:{type:String,maxLength:1,required:true},
    exercises:{type:Array,required:false}
})

module.export = mongoose.model('Training',TrainingSchema)