var waterfront = require('../').connect()
var sock       = waterfront.socket("sub")

sock.on("message", function(msg){
  console.log(msg)
})