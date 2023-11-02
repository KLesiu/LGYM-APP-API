const Router = require("express").Router()
const planController = require("../controllers/planController")

Router.post('/:id/configPlan',planController.setPlanConfig)
Router.get('/:id/configPlan',planController.getPlanConfig)

module.exports = Router