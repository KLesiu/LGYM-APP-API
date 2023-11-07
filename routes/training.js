const Router = require("express").Router()
const trainingController = require('../controllers/trainingController')

Router.post('/:id/addTraining',trainingController.addTraining)
Router.get('/:id/getTrainingHistory',trainingController.getTrainingHistory)
Router.get('/:id/getTrainingSession',trainingController.getCurrentTrainingSession)

module.exports = Router