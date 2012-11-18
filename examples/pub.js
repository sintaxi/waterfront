var waterfront = require("../").connect()
var sock       = waterfront.socket("pub")

setInterval(function(){
  sock.send({ pub: +new Date })
}, 200)