const Router = require("express").Router()
const userController = require("../controllers/userController")
const passport = require("passport")

Router.post('/register',userController.register)
Router.post('/login',passport.authenticate('local',{session:false}),userController.login)
Router.post('/isAdmin',userController.isAdmin)

module.exports = Router