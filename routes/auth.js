const Router = require("express").Router()
const userController = require("../controllers/userController")
const passport = require("passport")

Router.post('/register',userController.register)
Router.post('/login',passport.authenticate('local',{session:false}),userController.login)
Router.post('/isAdmin',userController.isAdmin)
Router.get('/userInfo/:id',userController.getUserInfo)
Router.post('/userRecords',userController.setUserRecords)

module.exports = Router