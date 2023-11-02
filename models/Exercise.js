const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ExerciseSchema = new Schema({
    name:{type:String,maxLength:40,required:true},
    reps:{type:String,required:false},
    repCurrent:{type:Number,required:false},
    weight:{type:Number,required:false},
    series:{type:Number,required:false}
})

module.exports = mongoose.model('Exercise',ExerciseSchema)