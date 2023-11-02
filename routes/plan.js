const Router = require("express").Router()
const planController = require("../controllers/planController")

Router.post('/:id/configPlan',planController.setPlanConfig)

module.exports = Router