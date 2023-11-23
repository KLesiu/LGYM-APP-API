const app = require('./index');
require("dotenv").config()

let server; 

const port = process.env.PORT || 4000;
server=app.listen(port);
module.exports = server

