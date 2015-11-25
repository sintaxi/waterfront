var waterfront = require("../").connect()
var sock       = waterfront.socket('req')

setInterval(function(){
  sock.send({ req: +new Date }, console.log);
}, 1000)
