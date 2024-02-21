const Router = require("express").Router()
const planController = require("../controllers/planController")

Router.post('/:id/configPlan',planController.setPlanConfig)
Router.get('/:id/configPlan',planController.getPlanConfig)
Router.post('/:id/setPlan',planController.setPlan)
Router.get('/:id/getPlan',planController.getPlan)
Router.delete('/:id/deletePlan',planController.deletePlan)
Router.post('/:id/setSharedPlan',planController.getSharedPlan)

module.exports = Router