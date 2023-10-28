const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ExerciseSchema = new Schema({
    name:{type:String,maxLength:40,required:true},
    repMax:{type:Number,required:false},
    repMin:{type:Number,required:false},
    repCurrent:{type:Number,required:false},
    weight:{type:Number,required:false},
    series:{type:Number,required:false}
})

module.export = mongoose.model('Exercise',ExerciseSchema)