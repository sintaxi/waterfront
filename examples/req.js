var waterfront = require("../").connect()
var sock       = waterfront.socket('req')

sock.send({ req: +new Date }, function(rep){
  console.log(rep)
  process.exit()
});