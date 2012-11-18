var waterfront = require('../').connect()
var sock       = waterfront.socket('pull')

sock.on("message", function(data){
  console.log(data)
})
