const Router = require("express").Router()
const trainingController = require('../controllers/trainingController')

Router.post('/:id/addTraining',trainingController.addTraining)

module.exports = Router