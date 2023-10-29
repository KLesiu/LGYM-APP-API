const passport = require('passport')

exports.middlewareAuth = (req,res,next)=>passport.authenticate("jwt",{session:false})(req,res,next)