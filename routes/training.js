const Router = require("express").Router()
const trainingController = require('../controllers/trainingController')

Router.post('/:id/addTraining',trainingController.addTraining)
Router.get('/:id/getTrainingHistory',trainingController.getTrainingHistory)
Router.get('/:id/getTrainingSession',trainingController.getCurrentTrainingSession)
Router.get('/:id/getPrevSessionTraining/:day',trainingController.getPreviousTrainingSession)

module.exports = Router